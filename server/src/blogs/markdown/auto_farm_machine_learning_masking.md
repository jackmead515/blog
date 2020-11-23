So far I've made some facinating discoveries. And I want to share them with you while also teaching you a few tricks and tips on how to use matplotlib and opencv. It's pretty exciting stuff if your a nerd like me.

<details open>
<summary>Green Pixel Experiment Results</summary>
<br>
    <img src="https://www.speblog.org/image/autofarm/full_green_graph_back.png">
</details>

What your seeing is all the datapoints corresponding to the green pixels within the different
image classes. Unfortunately, for this initial experiment, I ran into a camera problem. The crappy
USB web camera I had was only rated at 720p. But, for some reason, it didn't want to take 720p images
sometimes! So I had to order a new one about half way through the experiment

The <b style="color: green;">green</b> dots correspond to images at 640x480 resolution and the <b style="color: red;">red</b> dots correspond to images taken at 1280x720 resolution.

Now if you haven't noticed, aside from the trendline upwards of green pixels over time, there is a major bump
in the amount of green pixels identified from 480p to 720p to 1080p! This is because higher resolution images
can take more detailed images and can detect more green! I mean, you've probably always known that, but seeing
it in graph form is even cooler. :cool:

But let me take a step back and actually show you how to extract the green pixels out of images.

## Organize the images

First, let's just organize out images into the different categories. Right now, my data is just randomly arranged in a folder called `images` in the format of `unix_time_milliseconds.png`. I want to now organize them via their proper resolutions. See the code below:

```python
import os
import imagesize

def find_and_sort_images(directory):
    image_files = os.listdir(directory)
    image_files = list(filter(lambda f: f.endswith('.png'), image_files))
    image_files = sorted(image_files)
    image_files = [os.path.join(directory, f) for f in image_files]
    return image_files

def groupby_resolution(images):
    groups = {}
    for file_name in images:
        resolution = imagesize.get(file_name)
        if resolution not in groups:
            groups[resolution] = []
        groups[resolution].append(file_name)
    return groups

images = find_and_sort_images('./images')
groups = groupby_resolution(images)
```

Very cool! I am using this nice package here <a href="https://pypi.org/project/imagesize/" alt="link">imagesize==1.2.0</a> to parse the resolution from the image. This is a much faster way than using `cv2.imread().shape` to get the resolution because it only attempts to read the header of the png file.

So what do I have as a data set after it's been grouped? Here are the results:

```
total images: 52656
resolution (1920, 1080): 20555
resolution (1280, 720): 26903
resolution (640, 480): 4960
resolution (-1, -1): 238
```

I have 52,656 images total overall. Over half of which are 480p and 720p. Only 20,555 images are 1080p. But, I also have 238 images that could not find the resolution at all! How could this happen?? Well upon inspecting the images, we find that these images are zero bytes in length. This is completely normal and expected to occur. Throughout my experience taking millions of images, the number one thing that seems to create this problem is insufficent voltage or a faulty camera.

The Raspberry Pi 3B+ can only supply 1 AMP of current. Additionally, it recommends a 5 Volt 2.5 AMP power supply connected to a micro usb cable. Supplying this much current to the PI with a standard phone charger and cable will not cut it. You'll need a much stronger supply. If you don't, you will see kernel messages or a "lightning bolt" if your watching the display through HDMI saying that there is insufficent supply. This is definitely something to watch out for if your trying to power devices.

To conclude, the best way to prevent this is to just supply a strong enough power supply, and add some checks in your code to prevent saving zero byte images.

## Extract the Mask

Moving onward, let's see the code that actually extracts the green pixels from an image of 1080p resolution.

```python
import cv2

def get_green_mask(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    lower_green = np.array([[55, 40, 40]])
    upper_green = np.array([[80, 255, 255]])
    mask = cv2.inRange(hsv, lower_green, upper_green)
    return mask

def apply_green_filter(image, mask):
    result = cv2.bitwise_and(image, image, mask=mask)
    return result, mask

file_name = groups[(1920, 1080)][0]
image = cv2.imread(file_name)
mask = get_green_mask(image)
filtered = apply_green_filter(image, mask)
```

So, we use the `imread()` function to read in an image. Next, we convert the color format from `RGB` to `HSV`. Instead of pixel information in the format of red, green, blue, we have hue, saturation, and brightness. Now, why would we want to do this?

If we used RGB, we would be defining a range of how intense the reds, greens, and blues are in an image. But this isn't really sutable for our application becase we already know we want to capture only green and nothing else. What would be better is if we could define what color we want to capture, and then only capture green pixels of a certain brightness or saturation. Basically, of a certain range of "discoloration". And this is exactly what HSV does for us.

First the `Hue`. The hue is just the base color. This information is encoded in a single byte from 0 to 255. I picked a range from 55 to 80 and it worked for my purposes. The best way to figure this out is simply to play around with the range. What I did is actually look at a few of my plant images and examine the leaf colors.

The second is `Saturation`. Saturation is basically the "colorfulness" of the pixel. It defines just how much the color pops out at you. It's useful if you are trying to take those grams and you want to pretend that you live back in the 90's when cameras didn't have as much clarity. In our use case, it helps to define a comfortable range in case there are different lighting conditions or the color of green from the plants changes over time. I've defined 40 to 255 as my based range and it seems to work out nicely for me.

The last is the `Lightness` or `Value` or `Brightness`. And it's exactly what it seems. It allows the pixel to define how intense the color is as if you were turning up the light or dimming it down. Again, very useful in our case as throughout the day the intensity of light changes. Again, I just threw a 40 to 255 range for this.

Now that we know what HSV is, the next step is to run `cv2.inRange()` which will extract a mask of pixels containing only the pixel information we gave it. To actually see the result of the mask extracted from the image, we call `cv2.bitwise_and()` to compute the bitwise and operation over our original image and the mask. In plain english, that loops over the pixels of the image and only keeps the ones that exist within the mask.

If we plot this information using matplotlib in the example below, we can see the results side by side:

```python
figure = plot.figure(figsize=(20, 5))
figure.add_subplot(1, 3, 1)
plot.title('Original Image')
plot.imshow(image)
figure.add_subplot(1, 3, 2)
plot.title('Image Mask')
plot.imshow(mask)
figure.add_subplot(1, 3, 3)
plot.title('Filtered Image')
plot.imshow(filtered)
```

<details open>
<summary>Image, Mask, Filtered Comparison</summary>
<br>
    <img src="https://www.speblog.org/image/autofarm/mask_comparison.png">
</details>

Oh we are really getting somewhere! Pretty dope right? Some masks are better than others as the lighting conditions change throughout the day. For whatever images and mask you have, play around with the color ranges. If your building a dataset, biasly pick a mask for each image that tries to capture the entire plant! (this is what I'm going to do in the future for instance segmentation).

But we still have so many unanswered questions, like, how do I visualize all the green pixels over time? What if I just want to look at an individual plants and it's growth rate? What if I want to compare the plants growth rates over time?

In the next blog, I will do just that. I hope you found something useful out of this blog. If you didn't, please describe how I can make it better in the comments below. For now, stay safe. Peace.