Okay so now we have masks to play around with. What kind of information can we get out of them? For now, until I build a dataset, the best we can do is look at the accumulation of green pixels over time. So lets walk through some fun python tricks to get that.

Using the `get_green_mask()` function in the previous blog, we are now creating a new function to total up all the green pixels.

```python
import cv2
import numpy as np

def get_total_green_pixels(image_file):
    image = cv2.imread(image_file)
    if image is not None:
        green_mask = get_green_mask(image)
        total_positive = green_mask[green_mask > 0]
        if len(total_positive) >= 0 and not np.isnan(total_positive).any():
            return len(total_positive)
```

The `green_mask` variable is just a numpy matrix of pixel values. It is zero if there is no green, and 255 if there is a green value. So we fetch all the non zero values from the mask, and return the len of that array giving us the total amount of pixels detected!

Simple enough, but this function is computationally expensive. Running `cv2.imread()` is an expensive function as it loads the entire image into a numpy array in memory. Lets write some code to run this function for every single image and make sure we are running it as fast as we can.

First, understand that we are generating a time series dataset. So lets write a smaller wrapper function to return a data point as `[timestamp, green pixels]`.

```python
def run_calculate_green_pixels(image_file):
    # image_file = "/path/to/file/123456789.png"
    unix_time_sec = int(image_file.split('/')[-1].split('.')[0]) / 1000
    image_date = datetime.datetime.fromtimestamp(unix_time_sec)
    total_pixels = get_total_green_pixels(image_file)
    return [image_date, total_pixels]
```

Cool! And now lets run this function as fast as we possibly can!

```python
import numpy as np
from tqdm import tqdm
from multiprocessing import cpu_count
from concurrent.futures import ThreadPoolExecutor

def calculate_green_pixels(image_group):
    total_green_pixels = []
    pool_size = cpu_count()
    chunks = np.array_split(image_group, len(image_group)/pool_size)

    for index in tqdm(range(len(chunks))):
        chunk = chunks[index]
        futures = []
        pool = ThreadPoolExecutor(pool_size)
        for image_file in chunk:
            futures.append(pool.submit(run_calculate_green_pixels, image_file))
        pool.shutdown(wait=True)

        results = [f.result() for f in futures]
        total_green_pixels.extend(results)

    numpy_green = np.array(total_green_pixels)
    return numpy_green
```

We make use of a `ThreadPoolExecutor` which will run the IO intensive function `cv2.imread()` concurrently! And to keep track of the progress, we split the image_group into chunks and use the `tqdm` library to print the progress. Running the code below in jupyter notebook, here are the results:

```python
print('calculating 1920x1080...')
pixels_1920x1080 = calculate_green_pixels(image_groups[(1920, 1080)])
with open('full_1920x1080_green_55x40x40_80x255x255.npy', 'wb') as f:
    np.save(f, pixels_1920x1080)

print('calculating 1280x720...')
pixels_1280x720 = calculate_green_pixels(image_groups[(1280, 720)])
with open('full_1280x720_green_55x40x40_80x255x255.npy', 'wb') as f:
    np.save(f, pixels_1280x720)

print('calculating 640x480...')
pixels_640x480 = calculate_green_pixels(image_groups[(640, 480)])
with open('full_640x480_green_55x40x40_80x255x255.npy', 'wb') as f:
    np.save(f, pixels_640x480)
```

```shell
calculating 1920x1080...
100%|██████████| 2569/2569 [06:06<00:00,  7.01it/s]
calculating 1280x720...
100%|██████████| 3362/3362 [03:13<00:00, 17.33it/s]
calculating 640x480...
100%|██████████| 620/620 [00:14<00:00, 42.10it/s]
```

Definitely took some time to compute. But, using `np.save()`, we saved the results to a .npy file to load later and we never have to run this code again!

Finally, we have our dataset. Keep in mind that this is only one range of green color. If you want to adjust the color range, you'll have to run all of that code again. But, lets just deal with what we got, and graph it!

```python
import numpy as np
import matplotlib.pyplot as plot

full_1920x1080_green = np.load('full_1920x1080_green_55x40x40_80x255x255.npy', allow_pickle=True)
full_1280x720_green = np.load('full_1280x720_green_55x40x40_80x255x255.npy', allow_pickle=True)
full_640x480_green = np.load('full_640x480_green_55x40x40_80x255x255.npy', allow_pickle=True)

plot.style.use('default')
plot.figure(figsize=(15, 6))
plot.plot(full_1920x1080_green[:, 0], full_1920x1080_green[:, 1], 'b.', label="1920x1080")
plot.plot(full_1280x720_green[:, 0], full_1280x720_green[:, 1], 'r.', label="1280x720")
plot.plot(full_640x480_green[:, 0], full_640x480_green[:, 1], 'g.', label="640x480")
plot.legend(loc="upper left")
plot.xlabel('Time (year-month-day)')
plot.ylabel('Total Green Pixels')
plot.title('Green Pixels of Basil Crop Over Time (28 days)')
plot.show()
```

The data is stored as a numpy matrix instead of a pandas dataframe. Why? I dunno. Because I want too? Jeez. The first column in the tensors is the timestamp in milliseconds, the second column is the value. After graphing, we have a pretty clear view of the green pixel information.

<details open>
<summary>Green Pixel Experiment Results</summary>
<br>
    <img src="https://www.speblog.org/image/autofarm/full_green_graph_back.png">
</details>

Clearly, there is a trend upwards of green data (regardless of the different resolution). But there is also SOOO much noise! Let's try to clear that up.

Let's focus on a few things. For, lets look at the best resolution images (1080p). Let's also try to aggregate some of the data. It's safe to assume that per hour, the change in green pixels really isn't that different. My basil doesn't grow that fast...

```python
import pandas as pd
import numpy as np

frame = pd.DataFrame(np.load('full_1920x1080_green_55x40x40_80x255x255.npy', allow_pickle=True))
frame.columns = ['timestamp', 'value']

frame.timestamp = pd.to_datetime(frame.timestamp, unit='ms')
frame.value = pd.to_numeric(frame.value)

frame = frame.groupby(pd.Grouper(key='timestamp', freq='1H'))['value'].agg('median')
frame = frame.to_frame().reset_index()
frame = frame.dropna()

frame.describe()
```

We load in the dataset, (yes into a dataframe this time :sweat_smile:). We convert the timestamp column into datetime values and the value column to numeric values. This allows us to do the fancy `groupby()` aggregation and group all the data points into 1 hour intervals. After selecting the median value, and a few fancy stuff to convert the frame back into a pandas DataFrame, we call `describe()` to see the overview of results.

```shell
count - 286.000000
mean - 51977.288462
std - 14697.838044
min - 9249.500000
25% - 42666.750000
50% - 50830.250000
75% - 62301.000000
max - 92126.000000
```

Wow! Reduced `20555` values into `286`. Quite a lot. And sure enough, it does seem to reduce a lot of the noise. If we graph it simply, we see this:

```python
import matplotlib.pyplot as plot

plot.figure(figsize=(15, 6))
plot.plot(frame.timestamp.values, frame.value.values, 'b.', label="1920x1080")
plot.legend(loc="upper left")
plot.xlabel('Time (year-month-day)')
plot.ylabel('Total Green Pixels')
plot.title('Green Pixels (Retained only 9am to 4pm)')
plot.show()
```

<details open>
<summary>Aggregated One Hour Results</summary>
<br>
    <img src="https://www.speblog.org/image/autofarm/full_green_graph_early_late_back.png">
</details>

And that's just going to about wrap it up for me. In the next blog, I'll go over some different machine learning algorithms along with neural networks that try to show the rate of green pixels growing over time. Until then, I hope you gained somethng from this. If not, let me know in the comments. Stay safe. Peace.