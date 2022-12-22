Last time we left off, I was trying to correct the affine transformations to be more fluid and stable without wildly flying off the screen.

Well... my previous method didn't work quite right. It did in fact made it so the transforms weren't as dramatic, but it was still jittery at some portions. I didn't say I had all the answers :smile:. I'm still learning all this stuff too. I'll take another crack at it in the future once I understand the questions I'm trying to answer a bit better.

A new question that popped into my head though sounds more fun:

> Can the different colors in the footage indicate something interesting?

Well let's try to figure that out. How could these features help?

## Color Masking

We know that my footage, and most other dive footage, is going to be very green and blueish. Is that because that's the color of the reef? Not really. The reef is mostly gray, brown, with some yellows, greens, and a little blue thrown in there. Let's first identify some filters that can be used to capture all the primary and secondary colors in the color wheel:

```python
color_map = {
    'red': [
        {
            'lower': np.array([0, 50, 50]),
            'upper': np.array([10, 255, 255])
        },
        {
            'lower': np.array([161, 50, 50]),
            'upper': np.array([179, 255, 255])
        }
    ],
    'orange': {
        'lower': np.array([11, 50, 50]),
        'upper': np.array([25, 255, 255])
    },
    'yellow': {
        'lower': np.array([26, 50, 50]),
        'upper': np.array([34, 255, 255])
    },
    'green': {
        'lower': np.array([35, 50, 50]),
        'upper': np.array([77, 255, 255])
    },
    'blue': {
        'lower': np.array([78, 50, 50]),
        'upper': np.array([125, 255, 255])
    },
    'purple': {
        'lower': np.array([126, 50, 50]),
        'upper': np.array([160, 255, 255])
    },
    'white': {
        'lower': np.array([0, 0, 200]),
        'upper': np.array([179, 30, 255])
    },
    'black': {
        'lower': np.array([0, 0, 0]),
        'upper': np.array([179, 255, 30])
    },
    'brown': {
        'lower': np.array([0, 0, 31]),
        'upper': np.array([179, 255, 100])
    },
}

def get_colored_pixels(color, frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    mapp = color_map[color]

    if isinstance(mapp, list):
        mask = cv2.inRange(hsv, mapp[0]['lower'], mapp[0]['upper'])
        mask += cv2.inRange(hsv, mapp[1]['lower'], mapp[1]['upper'])
    else:
        mask = cv2.inRange(hsv, mapp['lower'], mapp['upper'])

    masked = cv2.bitwise_and(frame, frame, mask=mask)
    return masked


image = cv2.imread('../color_wheel.jpg')

for color in sorted(color_map.keys()):
    mask = get_colored_pixels(color, image)

    print(color)

    # display the image
    cv2.imshow('frame', mask)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
```

When we run this little script on a color wheel, we can tune the color parameters to get what we need. Then we can get an idea of the different colors present in the image by graphing the total amount of pixels that pertain to this range.

```python
for color in sorted(color_map.keys()):
    mask = get_colored_pixels(color, frame)

    # convert to grayscale
    gray = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)

    # get the total number of pixels
    total = gray.shape[0] * gray.shape[1]

    # get the total number of pixels with color
    total_color = np.count_nonzero(gray)

    # get the percentage of pixels with color
    percentage = total_color / total

    data.append([color, percentage, frame_index])
```

<img style="margin: auto; max-width: 500px;" src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/color_wheel.gif">

<img style="margin: auto; max-width: 500px; max-height: fit-content !important;" src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/color_profiles.png">

This is actually really funny to see this because what more could I expect. Of course the camera is only really capturing blues with a few browns and greens thrown in there. It's just really hard to detect virtually any other colors with my crappy camera! But, maybe there is some pattern to those colors that change over time to indicate something interesting.

When we check to see the top most influential colors, we find this:

```python
top_colors = df.groupby('color').sum().sort_values('percentage', ascending=False).head(5).index
print(top_colors)

Index(['blue', 'brown', 'black', 'green', 'white'], dtype='object', name='color')
```

Let's graph the blue, brown, and green's together with the rest of our data (the motion and the objects). Note hear that in order to display it all on one graph I use a scaler to convert the values to be between 0 and 1.

<img src="https://speblog-storage.s3.us-west-1.amazonaws.com/images/fix-dive/with_color_features.png">

Wow. Lots of data :fire: :heart: I really like this. A very valuable note to make here is that I don't have a lot of variation in the green and brown colors when the footage is uninteresting. But, there is a lot more flucuation when there is something interesting! So this again may be another variable to consider. Quickly, I'll pop back over to our classifier and see how it performs

```python
# get the x (the features) from the dataframe
x = df.drop(['rating'], axis=1).values

# get the y (the rating column) from the dataframe
y = df['rating'].values

accuracy = []

# perform multiple different random states to see if the accuracy changes
for i in range(0, 10):
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=i)

    classifier = make_pipeline(
        StandardScaler(),
        SGDClassifier(max_iter=1000, tol=1e-3, loss='perceptron')
    )

    classifier.fit(x_train, y_train)

    test_results = classifier.predict(x_test)
    train_results = classifier.predict(x_train)

    test_score = metrics.accuracy_score(y_test, test_results)
    train_score = metrics.accuracy_score(y_train, train_results)

    print('test', test_score, 'train', train_score)

    accuracy.append(test_score)

print('average accuracy', np.average(accuracy))
print('std accuracy', np.std(accuracy))
```

And sure enough, we are roughly <b style="color: lime">87%</b> accurate! Which seemed to be an improvement from the previous dataset when we only considered movement and objects detected.

```text
test 0.7659574468085106 train 0.8602150537634409
test 0.9574468085106383 train 0.9086021505376344
test 0.9148936170212766 train 0.9408602150537635
test 0.8723404255319149 train 0.9086021505376344
test 0.9361702127659575 train 0.9193548387096774
test 0.9574468085106383 train 0.9086021505376344
test 0.9148936170212766 train 0.9354838709677419
test 0.9148936170212766 train 0.9193548387096774
test 0.8723404255319149 train 0.9516129032258065
test 0.6170212765957447 train 0.7043010752688172
average accuracy 0.8723404255319149
std accuracy 0.10024867225012551
```

Full stop though. I have to caution the reader that all this data is gathered from a single 38 second clip. I really haven't dove into multiple clips from different parts of the world: I've been scuba and free diving in Hawaii, Columbia, Panama, Florida, and Puerto Rico now. There is a lot of dive footage to process. One thing that we need to figure out is if any of this makes a difference when we apply it to the diversity of footage out there. I have to spend a lot of time annotating my many hours of dive footage (or consider hiring some grunt labor to do that for me)

But I think this is a good stopping point for this blog. For now, stay safe. Peace. :santa: