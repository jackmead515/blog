In this blog I'm going to explore another data point that may or may not provide interesting footage of my scuba dives. I don't know. I'm literally writing this sentence without having assessed the code or the data yet :sweat_smile:

But! that's okay. Because that's just how I write. When preparing to write this blog though, I thought it would be really important to actually annotate my sample video and capture the data about what is actually interesting to me. It's subjective of course, but that's perfectly okay if the footage is just for me. If I was to do a larger anaylsis that would include multiple peoples opinions, I would need a lot of annotated videos from a diverse audience pool: including people who have never even scuba dived!

My plan is to randomly select around 20% of the frames from the video and then blend them together to create hotspots of interest. I have no code for this, because I did it the hard way, but here are the results:

<img src="/images/fix-dive/annotated.png">

The <b style="color: red">red</b> is uninteresting, the <b style="color: green">green</b> is interesting. There is only a smaller portion of the dive footage that is uninteresting and it's mostly due to the footage being really shaky. Maybe this won't be enough footage. But, eh, we have something to test on for now.

So how do we test motion blur? Well, there are two methods I know of:

- The Lucas-Kanade method: this can test the movement of a single point during motion. May not be good for this because we need overall footage or "shakyness". https://www.geeksforgeeks.org/python-opencv-optical-flow-with-lucas-kanade-method/

- The Gunnar-Farneback method: this method actually shows the different between all points within two frames. This seems much more like what we need as it can give us a sense of "shakyness". https://www.geeksforgeeks.org/opencv-the-gunnar-farneback-optical-flow/

We can easily calculate it like this assuming you have the previous frame.

```python
next_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
flow = cv2.calcOpticalFlowFarneback(prev_frame, next_frame, None, 0.5, 3, 15, 3, 5, 1.2, 0)
median_motion = np.median(flow)
```

This will produce the median value for the total amount of motion in the frame. But, high motion could simply be due to that freaky shark or the massive school of fish. Not nessesarily the camera shaking. When we graph this data we see something like this:

<img src="/images/fix-dive/annotated_median_motion.png">

At first this looks quite promising! We see lots of movement around the point at which the footage isn't interesting. But there is still movement even after that when the camera isn't nearly as shaky.

Well, first thing that comes to mind is that if the camera is shaky, then you would expect everything in the image to be in relatively high motion. So maybe we could look at each object detected and see if they are all moving relatively the same. Or, split up the frame into a grid an anaylze each section one by one.

Let's look at a grid first and see what happens.

```python
window_width = math.ceil(frame.shape[0] * 0.1)
window_height = math.ceil(frame.shape[1] * 0.1)

grid_id = 0
for x in range(0, frame.shape[0], window_width):
    for y in range(0, frame.shape[1], window_height):
        xx = x + window_width
        yy = y + window_height
        median_motion += np.median(flow[x:xx, y:yy])
        data.append([frame_count, grid_id, median_motion])
        grid_id += 1

df = pd.DataFrame(data, columns=['frame_index', 'grid_id', 'motion'])

fig = plt.figure()
ax = fig.gca(projection='3d')

df\
    .groupby(['grid_id'])\
    .apply(lambda x: ax.plot3D(x['frame_index'], x['grid_id'], x['motion']))\

ax.grid('on')
plt.show()
```

<img src="/images/fix-dive/grid_motion.png">

Well it was fun to generate a 3D graph. It is readily apparent that there is movement over all the grid sections during the uninteresting portion of frames. But right now this is no different then just taking the median motion of the entire frame. So for now, I'll put a pin in this and just use the overall motion of the whole frame. But we should come back to this at some point as it may be useful when understanding the movement of some objects or sections of a frame versus others.

Let's graph all our data points together and have a brain storming session:

<img src="/images/fix-dive/motion_objects_annotated.png">

Some key indicators come to mind:

- Object count alone, low or high, is not enough to conclude that the footage is interesting.

- Low objects and lots of noise may be a strong indicator of uninteresting footage.

- Lots of noise and high objects may be an indicator of interest rather than uninterest.

So, maybe we are ready for some machine learning? Let's try a super stupid simple classifier and see if there are any positive results.

```python
xdf = pd.read_csv('../data.csv')
ydf = pd.read_csv('../annotated.csv')

# doing a join because I didn't annotated every single frame
df = xdf.join(ydf, on='frame_index', how='inner', lsuffix='_x', rsuffix='_y')
df.drop(['frame_index_x', 'frame_index_y'], axis=1, inplace=True)
data = df.to_numpy()

x = data[:, 1:-1]
y = data[:, -1]

# the famous train test split!
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

# Basic Linear SVM classifier trained with stocastic gradient decent
# Data needs to be normalized in an SVM.
classifier = make_pipeline(
    StandardScaler(),
    SGDClassifier(max_iter=1000, tol=1e-3)
)

classifier.fit(x_train, y_train)

results = classifier.predict(x_test)

# classification accuracy is easy: you either guess right or you don't
score = metrics.accuracy_score(y_test, results)

print(score)
```

The score doesn't look too bad. I ran it several times with various random states of the `train_test_split` and mostly got <b style="color: lime;">80% or more accuracy</b>! Pretty cooooooooooool :)

But it really means nothing unless I have a validation set: another completely annotated video, preferably a longer one with more interesting aspects in it.

In addition, it might make more sense to attempt to stabilize the footage first. That way, the motion might coorespond more too creatures that are interesting and be a more positive indicator of interesting footage then a negative one.

Not only do I compress the images but I also don't utilize the full frame rate. This could negatively affect the ability to measure motion! It's worth analyzing that to see if I can optimize it.

We could also try to use the other method: Lucas-Kanade, and identify interesting points. This might lead to other conclusions! Who knows.

But, like the last blog, this blog has reached it's end. In the next blog, it's possible we will explore more potential data points, anaylze more videos, or continue with motion detection. I'm so excited!!

