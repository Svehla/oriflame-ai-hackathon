# from __future__ import absolute_import, division, print_function



# TensorFlow and tf.keras
import tensorflow as tf
from tensorflow import keras

# Helper libraries
import numpy as np
# import matplotlib.pyplot as plt

x_data = np.array([
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
])
print(x_data.shape)
y_data = np.array([
  [0],
  [1],
  [1],
  [0],
])

model = keras.Sequential()
model.add(keras.layers.Dense(32, activation='sigmoid', input_shape=(2,)))
model.add(keras.layers.Dense(1, activation='sigmoid'))

optimizer = keras.optimizers.SGD(lr=0.1)

model.compile(optimizer=optimizer, loss='binary_crossentropy', metrics=['accuracy'])
print(tf.__version__) 
model.summary()

# model.fit(x_data, y_data, batch_size=4, epochs=50)
model.fit(x_data, y_data, batch_size=4, epochs=3)

model.save_weights('./weights/my_model')

print('_done')


predict = model.predict(x_data)
print(predict)
import json
import pprint
# model.load_weights('./weights/my_model')
lol = model.to_json()
print(lol)
pprint.pprint(json.loads(lol))

print("hovno")