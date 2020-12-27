Soil moisture is definitely a key data point I want to track when
growing my plants. It allows me to view exactly how fast the moisture
is evaporating from the soil and tells me when I show probably
water the plants again.

But, without using some intuition, I can't really tell when exactly around what time I will have to water my plants. In order to do that, I would have to apply some machine learning!

Now then, the soil sensors I am using output a value range of 0 to 1023.
But to be honest, I have never seen it dip below 300 nor rise above 600. Not that it really matters though, because in the end if I use the same sensors with the same electronics, the <b>rate of change</b> should be approximatly the same function after the data is <b>normalized</b>. At least, that's what I hope.

Let's first load and wrangle some of the data and graph it. First, load it.

```python
import pandas as pd
df = pd.read_csv('../full_dataset/soil_full_sensor_one.stripped.csv')
df.head()
```

Looking at the top of the dataframe, here is the form of the data.

```
value,timestamp
400,2020-10-10 07:00:00.607519043
400,2020-10-10 07:00:00.619821289
400,2020-10-10 07:00:02.719929199
402,2020-10-10 07:00:02.734273193
401,2020-10-10 07:00:04.854030518
401,2020-10-10 07:00:04.866216797
402,2020-10-10 07:00:06.973232178
402,2020-10-10 07:00:06.985046875
```

Now, we do a bit of wrangling because this dataset is actually 2,081,411 data points!! Each data point is 0.5 seconds apart from one another and there is just absolutely no way we need that much resolution for soil that evaporates over the course of hours. So let's bucket the data into the averages every 60 seconds. That should be really easy with pandas.

```python
import numpy as np
from dateutil import parser as dateparser

# convert the iso strings to unix milliseconds
df.timestamp = [dateparser.isoparse(x) for x in df.timestamp]
df.timestamp = df.timestamp.astype(np.int64) / 1E6

# now that it's in milliseconds, we can convert to pandas datetime
df.timestamp = pd.to_datetime(df.timestamp, unit='ms')

# using this awesome pandas Grouper, we can easily group the value column into buckets and then aggregate it into the average. Piece of cake.
df_group = df.groupby(pd.Grouper(key='timestamp', freq='60s'))['value'].agg('mean')

# Grouper doesn't return a DataFrame. So convert it into one!
df_group = df_group.to_frame().reset_index()

# convert the timestamp back into unix millisecond timestamps
df_group.timestamp = df_group.timestamp.astype(np.int64) / 1E6

# there might be a few rows that are nan now after the aggregation. So drop them!
df_group = df_group.dropna()
```

Now one important piece of data that we need to load is the times of each watering. During the course of the experiment, I went old school and wrote down the times in which I watered the plants. This helped in the future when I went to split the data into buckets by these times. So let's load that, and then graph the data and the watering times.

```python
import matplotlib.pyplot as plot

dfw = pd.read_csv('../full_dataset/soil_water_times.csv')

plot.figure(figsize=(20, 4))
plot.xlabel('Time (unix milliseconds)')
plot.ylabel('Soil Moisture (Conductivity) Value')
plot.title('Soil Moisture over Time')
plot.plot(df_group.timestamp, df_group.value, '.')
for time in dfw.timestamp:
    plot.axvline(x=time, color='red')
plot.show()
```

<img src="http://127.0.0.1:5000/image/autofarm/agged20s_soil_moisture_marked.png">

The data looks... not good, depending on your perspective. But to me, the watering times are pretty much spot on, and, each segment looks to have a very similar slope, which is the key to this experiment.

So let's continue with the code and split the data into buckets by each of the watering times. Which, is incredible easy with the pandas library.

```python
# get the bins from the dataframe. I sorted them for sanity.
bins = sorted(dfw.timestamp.values)

# create the bins on a new column in the dataframe. Super easy!
df_group['binned'] = pd.cut(df_group.timestamp, bins)

# drop any na data and reset the index just like we did before
df_group = df_group.dropna()
df_group = df_group.reset_index()

# group the data by the bins and get the indicies of those groups
df_groups = df_group.groupby(['binned']).groups
df_groups_keys = list(df_groups.keys())
marked = []
 
for key in df_groups_keys:
    # get the list of indicies in the group
    indicies = sorted(df_groups[key])

    # select all the rows from the indicies!
    frame = df_group.iloc[indicies]

    # drop the binned column and append the dataframe to the list
    frame = frame.drop(['binned'], axis=1)
    marked.append(frame)
```

Sometimes, Python is a pain in the butt. But when you really know how to utilize it, it just makes life so much easier. So let's continue and now plot all the of sections!

```python
figure, axises = plot.subplots(4, 4, figsize=(15, 10))
axises = [item for sublist in axises for item in sublist]
figure.tight_layout(h_pad=4)

for index in range(len(marked)):
    frame = marked[index]
    axises[index].set_title(f'Index {index}')
    axises[index].plot(frame.timestamp, frame.value, '.')
plot.show()
```

<details open>
<summary>Individual Drops in Moisture from Sensor 1</summary>
<br>
    <img src="http://127.0.0.1:5000/image/autofarm/soil_agged60s_marked_split.png">
</details>

So far, the data is looking kinda janky! At least to the untrained eye. But after we apply some simple linear regression to it, it's actually really linear indeed. So lets do that. The following code is a bit lengthy, but bare with me. 

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split

# declare the figures for the plots
figure, axises = plot.subplots(4, 4, figsize=(15, 10))
axises = [item for sublist in axises for item in sublist]
figure.tight_layout(h_pad=4)

for index in range(len(marked)):
    frame = marked[index]

    # delete the index column and convert to numpy matrix
    matrix = np.delete(frame.to_numpy(), 0, 1)

    # scale the entire matrix
    scaler = StandardScaler().fit(matrix)
    matrix = scaler.transform(matrix)

    # extract the x and y and reshape to be like [[1], [2], ...]
    y, x = matrix[:, 0].reshape(-1, 1), matrix[:, 1].reshape(-1, 1)

    # sklearn train test split! easy.
    x_train, x_test, y_train, y_test = train_test_split(x, y, random_state=42)

    # even easier, fit a linear regression model!
    model = LinearRegression()
    model.fit(x_train, y_train)

    # make predictions on the test set
    y_pred = model.predict(x_test)

    # calculate the mean squared error for the linear predictions
    error = mean_squared_error(y_test, y_pred)

    # plot the predictions! 
    axises[index].set_title(f'index {index} - error: {round(error, 4)}')
    axises[index].plot(y_train, x_train, 'b.')
    axises[index].plot(y_pred, x_test, 'r.')

plot.show()
```

<details open>
<summary>LinearRegression Applied to Sensor 1</summary>
<br>
    <img src="http://127.0.0.1:5000/image/autofarm/soil_linear_models.png">
</details>

Now, even to the untrained eye, that is very linear in behavior. Which is super excellent indeed. It makes the job of machine learning exceptionally easy. But, we are missing one thing. We normalized the y axis. Which means we lose a lot of the distribution of the time. So lets repeat the code above but remove the standarization part. 

If we plot the slopes, getting the slope using `model.coef_[0][0]`, we see... something interesting.

<img style="max-width: 500px; margin: 0 auto;" src="http://127.0.0.1:5000/image/autofarm/soil_linear_slopes_notnorm.png">

The slope is increasing over time. Or, at least, if it's not increasing, it sure isn't the same each time. This could be due to a multitude of reasons. For one, the soil chemistry changes overtime as the plants suck up more nutrients from it. In addition, as the plants grow, you might expect the slope to increase as they will consume more water as they grow. But I think one of the biggest things we fail to gather is <b>light intensity</b>.

I noticed that day to day, I get different light intensity values at different times of the day. I don't have my plants underneath a grow light. The conditions are subject to the intensity of the light and the cloud coverage given the time. So, in order to real model the behavior of the soil, I would need that extra datapoint.

Hopefully this was an intuitive approach in understanding how we might model soil moisture consumption over time. This is absolutely not the last time we will look at this dataset are there are plenty of other things we can do to decrease error rates in our models. We could apply a recurrent neural network like an LSTM to have better predictive powers. We can analyze humidity, temperature, and light intensity in a PCA anaylsis to see how they affect the soil moisture. I could also just do a better job at gathering data and making a stable environment for my plants to grow; like recording the water recording times more accurately or doing the experiment over a longer time span.

In any case, you can guarantee that I will be coming out with full tutorials walking you through all these different techniques and sharing the results with you! Until next time, stay safe. Peace.