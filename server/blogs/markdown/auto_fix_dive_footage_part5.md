I think I got the stabilization to a point where I can write about it. And also continue to complain about it.

I fixed my smoothing function out by appling a rolling average to the outliers. Before, I was using a niave tactic that simply tried to normalize the values between a certain range. I thought, that's kinda silly. Instead, it would much simpler to just say that if you are an outlier, smooth yourself out more than you normally would. Something like this...

```python
scaled_df = df.copy()
outlier_smooth_window = 50

for i in range(df.shape[0]):
    # if is an outlier, replace with rolling average
    if df.iloc[i]['outlier_factor'] == -1:
        start = i - outlier_smooth_window
        end = i + outlier_smooth_window

        if start < 0:
            start = 0

        if end > df.shape[0]:
            end = df.shape[0]

        scaled_df.loc[i, 'stabilize_dx'] = df.loc[start:end, 'stabilize_dx'].mean()
        scaled_df.loc[i, 'stabilize_dy'] = df.loc[start:end, 'stabilize_dy'].mean()
        scaled_df.loc[i, 'stabilize_da'] = df.loc[start:end, 'stabilize_da'].mean()
```

<div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 10px; text-align: center;">
    <div>
        <img src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/stabilization_before.png">
        <p>Before Stabilization</p>
    </div>
    <div>
        <img src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/stabilization_after.png">
        <p>After Stabilization</p>
    </div>
</div>

And sure enough, that seems to work pretty effectively. I could do something like utilize the `negative_outlier_factor_` on the `LocalOutlierFactor` model from sklearn as a parameter in determining the window size for the average. A factor that indicates more of an outlier should use a bigger window size than an outlier that isn't that big. But we can save that for future optimization.

The goal of this post is to talk about the fact that my script operates at a very slow speed: calculating the stabilization on my machine only goes around 25 FPS. :confounded:

Why is it going so slow? Well, writing out the code logic in puedo-code will help answer the why and how we might optimize it.

```python
for every frame in video

    # convert to a gray frame
    gray_frame = convert_to_gray_frame(frame)

    # calculate trackable points using Shi-Tomasi Corner Detection
    points = calculate_point_features(gray_frame)

    # utilize the gray_frame, the points, and the previous frames points
    # to calculate the Lucas-Kanade optical flow
    prev_points = calculate_motion(gray_frame, points, prev_points)

    # estimate an affine transformation using the sets of points
    transform = estimate_affine_transform(points, prev_points)
```

When I test how long these functions take, I find the results to be around this:

| Function | Compute Time (Linear) |
| --- | --- |
| Convert to Gray Scale | 19.8 seconds |
| Calculate Feature Points | 1 minute and 39.3 seconds |
| Calculate Motion | 7.8 seconds |
| Estimate Affine Transforms | 0.1 seconds |

On a 38 second clip, the cost of stabilization is more than double that of the actual clip duration! That's not gonna cut it when we have thousands of frames to parse through. Fortunately, I think I have a plan to solve that.

We can start with the gray scale conversion of images because this is the easiest to deal with.

We are going to utilize <a href="https://docs.dask.org/en/stable/">Dask</a> in this project and I suggest you take a look into it because it is a badass framework. I geek out about it because it's so simple. It's like Spark, but it's made for the machine learning engineers out there that only know how to use Python. It has an incredibly easy to use API, a really interactive UI to explore performance bottlenecks, and is super easy to make scaliable in Kubernetes or just via SSH and the command line.

Just putting the frames into Dask takes a bit of effort. This is understandable as data is being moved around and shuffled a bit. This takes just around `10 seconds` .

```python
chunk_size = (1, height, width, 3)
df = da.from_array(frames, chunks=chunk_size)
```

But afterwards, we can actually run and compute the gray scale images

```python
def convert_to_gray(frame):
    gray = cv2.cvtColor(frame[0], cv2.COLOR_BGR2GRAY)
    return np.expand_dims(np.expand_dims(gray, axis=0), axis=0)

gray_df = df.map_blocks(
    convert_to_gray,
    chunks=(1, 1, height, width),
    dtype=np.uint8
).compute()
```

But it takes `46.2 seconds`!! How can it possibly be that a linear execution takes less time than parallel process on 8 cores? Well a quick check shows that the `expand_dims` function is pretty slow. We can speed that up by changing it to this line:

```python
return gray[None, None]
```

Which is a nice little numpy trick. This literally takes `16 seconds` off. But we are still a bit slow. Let's try to use a different gray conversion technique with:

```python
gray = frame[0].dot([0.07, 0.72, 0.21])
```

Andd... that literally took so long that I stopped it. :smile:. Since Dask is a distributed compute framework, it doesn't nessesarily guarantee speed improvements. What it does guarantee is that if you split your data up appropriately, and you have enough machines (cpu cores, memory, and network bandwidth), you will increase the computation speed of a lot of data. So maybe the issue is with the chunk_size.

Currently, our Dask Array has a chunk per image. Let's try to see if there is a speed improvement if we use 10 images per chunk.

```python
chunk_size = (10, height, width, 3)
df = da.from_array(frames, chunks=chunk_size)

def convert_to_gray(frames):
    grays = []
    for frame in frames:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frames.append(gray[None, None])
    return np.array(grays)
```

And just as I suspected, that did the trick. Now we are at a total compute time of `21 seconds`. Can we go any lower? We can try to double the chunk size to 20 images per batch. Or maybe, since I have an 8 core machine, the most effective chunk size is one in where all 2400 frames are split evenly? That would be: 2400 / 8 = 300.

Again, lucky guess, that turns out to be our best compute time at only `13.5 seconds`. This isn't much faster than the original linear compute time, but that's because we are dealing with small amonts of data. I imagine that a clip of 30 minutes, which is 108,000 frames, will take some time to compute. And if we have an actual cluster, the compute time will be decreased.

But, I have a way we can actually go faster. Whattttt you say? Well, that's because I think now we are experiencing a memory problem. You see, when I call `from_array`, I've actually already loaded the entire video into memory and then I pass in the frames. This converts what is a 210 MB video file on disk to be 15 GB in memory.

```python
import psutil
import os

print(df.nbytes / 1e6, 'MB')

process = psutil.Process(os.getpid())
print(process.memory_info().rss / 1e6, 'MB')
```
```python
14929.92 MB
15346.19 MB
```

You see, if I tried to load a 30 minute clip into memory, my computer would crash. There is no way I can fit all of that in memory. And besides, moving all that memory around different processes is going to create some issues. Fortunately, there is this super slick project called <a href="https://zarr.dev/">Zarr</a> which is supposed to be the answer to my needs. Zarr allows you to store N-dimensional tensors into arbitrarily sized chunks that can be stored on disk or in a key-value storage solution. This means I can store the frames in S3 compatible storage and only load the chunks from the S3 store when requested! Storage and memory have now no longer become a problem. My only problem is money now :smile:

The files on disk look similar to how a Parquet table would look:

```python
/original_frames
    .zarray
    0.0.0.0
    1.0.0.0
    2.0.0.0
    ...
```

```python
# convert the 15 GB dask array to zarr file format
from dask.array import to_zarr

chunk_size = (1, height, width, 3)
df = da.from_array(frames, chunks=chunk_size)
to_zarr(df, '../data/original_frames')

# load the dask array from zarr
from dask.array import from_zarr
chunk_size = (1, 1080, 1920, 3)
df = from_zarr('../data/original_frames')
```

Now when I check the memory utilization, I see much different results:

```python
14929.92 MB
177.729536 MB
```

Finally, if we allow Dask to compute on the Zarr dask array (remember, dask is lazily computed so nothing has been loaded from memory yet), We bring the compute time down to `8.3 seconds`. This is less than half of the linear compute time. Holy code this is some really cool stuff.

Okay. Now with all that in our heads, we can go through each of the other functions using the same same techniques. The next function is the feature detection.

```python
def get_good_features(frames):
    features = []
    for frame in frames:
        points = cv2.goodFeaturesToTrack(
            frame[0],
            maxCorners=200,
            qualityLevel=0.01,
            minDistance=30,
            blockSize=3
        )

        if points is None:
            features.append(np.zeros((200, 1, 2), dtype=np.float32))
        else:
            features.append(points)
    return np.array(features)

points_df = gray_df.map_blocks(
    get_good_features,
    chunks=(1, 200, 1, 2),
    dtype='float32',
).compute()
```

And holy code!! We converted what was just over a minute and a half to `21.7 seconds` of computation time. Now, that's some really nice numbers :smile: Also note, that we didn't even have to properly chunk the Dask array (we are still using 1 chunk per image). I'm doing this because Zarr reccomends keeping the chunk size lower. Furthermore, when testing with 300 chunks versus 2400 chunks, it didn't really make an impact (it was actually slower by a few seconds).

So now we move onto actually calculating the motion. We are just gonna throw in the affine transforms here because it's such a trival calculation. But, regardless, we should see an improved compute time. 


This calculation is a bit tricky as it requires reference to the previous frame and it's feature points. The function `map_overlap` should do the trick. Butt... I never had success with it as I don't think I can map two blocks together on a specific axis. My arrays look like this:

```python
gray_frame shape = (2400, 1, 1080, 1920)
gray_frame chunk = (1, 1, 1080, 1920)

points shape = (2400, 200, 1, 2)
points chunk = (1, 200, 1, 2)
```

Fortunately, there is another framework that adds a lot more flexibility that I can leverage. That is the `delayed` framework. And, Dask Array can be casted immediately to a delayed type with `to_delayed()`. This will created a delayed item, one per chunk, that can be loaded with a call to `compute()`.

```python
points_df = from_zarr('../data/original_frames_points')
gray_df = from_zarr('../data/original_frames_gray')

gray_delayed = gray_df.to_delayed()
points_delayed = points_df.to_delayed()

delayed_motion = []
for i in range(len(gray_delayed)-1):

    prev_frame = gray_delayed[i]
    prev_points = points_delayed[i]
    next_frame = gray_delayed[i + 1]

    delayed_motion.append(
        delayed(compute_motion)(
            prev_frame,
            prev_points,
            next_frame
        )
    )

dask.compute(*delayed_motion)
```

But, I am running into some complications while running this. There is a bug that I can't quite figure out. So, for times sake, I will deal with it in the next blog post where we will run the entire pipeline and explain what the Dask UI shows us about the performance of this optimization.

It is quite clear though that Dask can make our video processing scaliable horizontally so one day we can process hundreds of thousands of frames in a short time. For now, stay safe. Peace.