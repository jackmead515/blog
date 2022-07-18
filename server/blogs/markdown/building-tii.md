Finally it's time to build our network. In this blog, we will explore different parameters to fine tune an AI to predict the weather. This blog is broken into two other blogs, links are listed below as well.

[Iowa Environmental Mesonet (ISU)](https://mesonet.agron.iastate.edu/request/download.phtml)

[Github Repo](https://github.com/jackmead515/python_ai/tree/master/temperature-in-iowa)

[Preparing the Data](http://www.speblog.org/blog/parsing-formatting-weather-data-numpy-pandas-sklearn)

[Visualizing the Data](http://www.speblog.org/blog/visualizing-weather-data-numpy-pandas-sklearn-matplotlib)

Parsing and formatting our dataset can take a while, but building and running our neural network can also take a long time. Selecting the layers we need usually doesn't take long at all (if you understand your dataset and the underlying problem to start). What takes a much longer time is fine tuning all the parameters in your network.

Good thing is, we already know what kind of network we want to build. That is a LSTM, or a Long Short Term Memory network. For reference and further reading, you can learn the exactness of the layer by peeking at the links below.

[Jeff Heaton Youtube Channel](https://www.youtube.com/watch?v=wY0dyFgNCgY&t=144s)

[Machine Learning Mastery](https://machinelearningmastery.com/time-series-prediction-lstm-recurrent-neural-networks-python-keras/)

[Keras LSTM Documentation](https://keras.io/layers/recurrent/#lstm)

Lets start off by first stacking together the layers of our network.

```python
from sklearn.metrics import mean_squared_error
from keras import models
from keras import layers
from keras import optimizers
from keras import losses

FEATURES = 1
WINDOW_SIZE = 24
NODES = 32
EPOCHS = 30
BATCH_SIZE = 100
OPTIMIZER = optimizers.Adam()
LOSS = losses.mean_squared_error

model = models.Sequential()
model.add(layers.LSTM(NODES, input_shape=(WINDOW_SIZE, FEATURES)))
model.add(layers.Dense(1))
model.compile(optimizer=OPTIMIZER, loss=LOSS)

history = model.fit(x_train, y_train, epochs=EPOCHS, batch_size=BATCH_SIZE)
x_pred = model.predict(x_test)
score = np.sqrt(mean_squared_error(x_pred, y_test))
print('Score (RMSE): {}'.format(score))
```

It's very easy to throw together a network with little effort. We are choosing to use an LSTM layer for the main guts of this ai. Then we apply a Dense layer with 1 output. This layer will use linear activation to produce one output, our prediction! Then, we compile our model with a loss of mean_squared_error and the adam optimizer. Evaluating the model using it's predict() method on the test set, we can compare the x_pred to the y_test using the mean_squared_error() method from sklearn. This will tell us just how far off our measurements are from the actual value.

"Now when I say 'tuning parameters', specifically what I am refering to is these specific parameters: <b>nodes, window_size, optimizer, loss, batch_size, and epochs</b>. Every single one of these parameters should be tuned to create the best network possible.

We will get back to these parameters in a little bit, but for now, let's have a little fun and just try and run the network over the year 2005. Remember, a WINDOW_SIZE of 1 means that it is roughly 1 hour in the past (we might get a better performing AI if we understand how and when the temperature predictably changes and change the window size accordingly). Below is 5 different rounds with different parameters. View the results of each one!


<details close>
<summary>Round 1</summary>
<br>

```bash
FEATURES = 1
WINDOW_SIZE = 1
NODES = 8
EPOCHS = 100
BATCH_SIZE = 500
OPTIMIZER = optimizers.Adam()
LOSS = losses.mean_squared_error

Epoch 1/100
8612/8612 [==============================] - 0s 39us/step - loss: 0.1648
Epoch 2/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.1454
Epoch 3/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.1294
Epoch 4/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.1165
Epoch 5/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.1057
...
Epoch 95/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.0022
Epoch 96/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.0022
Epoch 97/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.0022
Epoch 98/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.0022
Epoch 99/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.0022
Epoch 100/100
8612/8612 [==============================] - 0s 4us/step - loss: 0.0022

Training Time: 4.261866092681885 secs
Testing Score (RMSE): 1.4618483781814575
```

</details>

<details close>
<summary>Round 2</summary>
<br>

```bash
FEATURES = 1
WINDOW_SIZE = 12
NODES = 8
EPOCHS = 100
BATCH_SIZE = 500
OPTIMIZER = optimizers.Adam()
LOSS = losses.mean_squared_error

Epoch 1/100
8601/8601 [==============================] - 1s 61us/step - loss: 0.2035
Epoch 2/100
8601/8601 [==============================] - 0s 16us/step - loss: 0.1393
Epoch 3/100
8601/8601 [==============================] - 0s 17us/step - loss: 0.0946
Epoch 4/100
8601/8601 [==============================] - 0s 22us/step - loss: 0.0644
Epoch 5/100
8601/8601 [==============================] - 0s 17us/step - loss: 0.0443
...
Epoch 95/100
8601/8601 [==============================] - 0s 15us/step - loss: 0.0017
Epoch 96/100
8601/8601 [==============================] - 0s 15us/step - loss: 0.0017
Epoch 97/100
8601/8601 [==============================] - 0s 15us/step - loss: 0.0017
Epoch 98/100
8601/8601 [==============================] - 0s 15us/step - loss: 0.0017
Epoch 99/100
8601/8601 [==============================] - 0s 15us/step - loss: 0.0017
Epoch 100/100
8601/8601 [==============================] - 0s 15us/step - loss: 0.0017
Training Time: 14.28614592552185 secs
Testing Score (RMSE): 1.3082751035690308
```

</details>

<details close>
<summary>Round 3</summary>
<br>

```bash
FEATURES = 1
WINDOW_SIZE = 24
NODES = 16
EPOCHS = 100
BATCH_SIZE = 500
OPTIMIZER = optimizers.Adam()
LOSS = losses.mean_squared_error

Epoch 1/100
8589/8589 [==============================] - 1s 75us/step - loss: 0.1581
Epoch 2/100
8589/8589 [==============================] - 0s 39us/step - loss: 0.0730
Epoch 3/100
8589/8589 [==============================] - 0s 42us/step - loss: 0.0409
Epoch 4/100
8589/8589 [==============================] - 0s 40us/step - loss: 0.0251
Epoch 5/100
8589/8589 [==============================] - 0s 40us/step - loss: 0.0197
...
Epoch 95/100
8589/8589 [==============================] - 0s 40us/step - loss: 0.0015
Epoch 96/100
8589/8589 [==============================] - 0s 40us/step - loss: 0.0014
Epoch 97/100
8589/8589 [==============================] - 0s 42us/step - loss: 0.0014
Epoch 98/100
8589/8589 [==============================] - 0s 41us/step - loss: 0.0014
Epoch 99/100
8589/8589 [==============================] - 0s 40us/step - loss: 0.0014
Epoch 100/100
8589/8589 [==============================] - 0s 41us/step - loss: 0.0014
Training Time: 35.53422498703003 secs
Testing Score (RMSE): 1.2732785940170288
```

</details>

More to come... Stay tuned...