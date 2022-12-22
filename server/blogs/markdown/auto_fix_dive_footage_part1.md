I'm super into scuba diving. Something about the quietness, weightlessness, and the magestic nature is just bliss. Can't quite put my finger on it... BUT! Everytime I get footage of my dives they come out horrendous. It's super green, there are particles and marine snow everywhere, it's extremely shaking, there is a ton of footage with nothing interesting happening, and my shitty $100 camera has poor clarity in general.

How can I fix this? I could buy a really nice camera, get a stabelizer, a red light flashlight, spend another thousand dollars here, and there... or I could just invest some time and a little money in a GPU and write a program to automatically fix the footage for me.

I got to thinking one night: why can't all these new generative AI's out there fix my dive footage automatically? Should be relativly easy. Would be able to automatically make the colors "pop", fix the lighting, and enhance the resolution and clarity. Well, all that is possible and there is probably a paid product out there that will do it for you (or my girlfriend who is an awesome photographer).

But I'm a cheap and lazy engineer. I want to plug in my camera, have it upload all the footage automatically, anaylze it, slice and dice it, and spit out a condenced clip of all of the memorible moments from my dive. Sounds easy right?

Well, this is the first part of my journey to discover if that's possible. This guide will talk about how I identify "interesting" things from the footage to reduce the overall footage that is captured.

## What Is Interesting?

This is a really "interesting" question. But answering it is very complicated. What we see as interesting is a combination of many things. In scuba diving, it could be a specific animal, or some rock or coral structure, or simply the beauty of the crystal blue waters.

One data point that I believe plays a roll in this is the total amount of "objects" detected. I don't know quite yet if it alone can explain all that is interesting to us humans.

But essentially, "objects" are just sections of colors of an image that are different then it's surroundings. This could be floating particles, or little fishies, or heads and branches of coral. Very quickly, we can throw some code together and anaylze the objects detected over time.

```python
import cv2
import pandas as pd

capture = cv2.VideoCapture('../test.mp4')

# set the framerate low, no need to test every single frame
capture.set(cv2.CAP_PROP_FPS, 0.1)

frame_count = 0
data = []

while True:
    ret, frame = capture.read()
    if not ret:
        break
        
    frame_count += 1

    # convert to RGB (cv2 is weird)
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # rescale to save compute resources
    frame = cv2.resize(frame, (0, 0), fx=0.2, fy=0.2, interpolation=cv2.INTER_LANCZOS4)

    # detect all the objects in image
    ss = cv2.ximgproc.segmentation.createSelectiveSearchSegmentation()
    ss.setBaseImage(frame)
    ss.switchToSingleStrategy()
    objects = ss.process()

    data.append([frame_count, len(objects)])

capture.release()

df = pd.DataFrame(data, columns=['frame_index', 'total_objects'])
df.to_csv('objects.csv', index=False)
```

Super easy! This uses a very specific algorithm from the OpenCV library that comes preinstalled. You can read more about it here: <a href="https://docs.opencv.org/3.4/d6/d6d/classcv_1_1ximgproc_1_1segmentation_1_1SelectiveSearchSegmentation.html#a4ea50c9a9df83193dc16f9b74bd95805">Selective Search Segmentation OpenCV Documentation</a> and here: <a href="http://www.huppelen.nl/publications/selectiveSearchDraft.pdf">Selection Search Algorithm White Paper</a>. Of course, there are different methods, and we are going to look into multiple different ones. But this one only takes a minute or two on a short video clip. To graph the results, we just code:

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('objects.csv')

fig, ax = plt.subplots()
ax.plot(df['frame_index'], df['total_objects'])
ax.set_xlabel('Frame Index')
ax.set_ylabel('Total Objects Detected')
ax.set_title('Total Objects Detected Per Frame')
ax.grid('on')
plt.legend()
plt.show()
```

<img src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/objects.png">

Okay well very interesting results to say the least! Something is definetely going on here and it's worth anaylzing the peeks and valleys. Let's check that out. But first, we have to gather the video segments and convert them into gifs so I can embed them into my blog. Here is some fun code for that:

```python
import cv2
from PIL import Image

def convert_to_gif(images, file_name):
    frames = [Image.fromarray(frame) for frame in images]
    frames[0].save(file_name, format='GIF', append_images=frames[1:], save_all=True, duration=100, loop=0)


if __name__ == "__main__":

    capture = cv2.VideoCapture('../test.mp4')
    capture.set(cv2.CAP_PROP_FPS, 0.1)

    frame_count = 0

    high_interesting = []
    low_uninteresting = []
    low_interesting = []

    while True:
        ret, frame = capture.read()
        if not ret:
            break
            
        frame_count += 1

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = cv2.resize(frame, (0, 0), fx=0.2, fy=0.2, interpolation=cv2.INTER_LANCZOS4)
        
        if frame_count >= 1050 and frame_count <= 1200:
            high_interesting.append(frame)
        
        if frame_count >= 1250 and frame_count <= 1350:
            low_uninteresting.append(frame)

        if frame_count >= 200 and frame_count <= 300:
            low_interesting.append(frame)

    capture.release()

    # create a video from frames
    convert_to_gif(low_interesting, 'low_objects_interesting.gif')
    convert_to_gif(high_interesting, 'high_objects_interesting.gif')
    convert_to_gif(low_uninteresting, 'low_objects_uninteresting.gif')
```

<div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 10px;">
    <div>
        <img src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/high_objects_interesting.gif" style="max-height:50vh; width:auto; height:auto;"></img>
        <p>High Object Count and Interesting</p>
    </div>
    <div>
        <img src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/low_objects_uninteresting.gif" style="max-height:50vh; width:auto; height:auto;"></img>
        <p>Low Object Count and Uninteresting</p>
    </div>
    <div>
        <img src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/low_objects_interesting.gif" style="max-height:50vh; width:auto; height:auto;"></img>
        <p>Low Object Count and Interesting</p>
    </div>
</div>

We can see that effectively there are True Positives (high objects that are interesting), True Negatives (low objects that are not interesting), but debately also some False Negatives (low objects that are actually interesting). With the given clip I had I didn't find any False Positives (high objects that weren't interesting). But maybe that's just because of the nature of the reef system:

> Sometimes nothing is interesting and usually some things are interesting.

This hypothesis doesn't bode well if I intend to use just object detection in order to clip my video down to a condenced view of only interesting footage. Whether or not the hypothesis is true, it seems readily apparent that the total objects detected is not enough to conclude "interesting" footage.

So what are some other data points I could utilize? Some things that come to mind:

- Calculating motion blur: when my hands are super shaking I typically don't get very good footage. You'll notice that is the case in the uninteresting gif above.

- I could randomly annotate segments of the video at question and "categorize" it with a scale of 1-10 (uninteresting to really interesting) and then create a smoothing function to grab the clips around these regions of the footage. That could prove very useful, but also tedious and not very automated. Still a really good datapoint. I may have to do this anyways in order to get a test and validation set of data.

- The video footage may be a little shitty because my camera is really cheap. A lot of particles and "noise" could be accidently detected. So I could use some morphological transformations in the OpenCV package to "clean up" the footage and then do object detection on the result. This could prove useful.

- I could anaylze the colors in each frame and how they are changing over time. The diversity of colors could be an indicator of something of interest. This would be quite inexpensive and easy to perform.

But, this blog has reached it's end. Thanks for paying attention. Stay stafe. :heart_decoration: