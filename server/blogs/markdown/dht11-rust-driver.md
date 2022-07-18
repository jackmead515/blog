If there is one thing I like, it's getting electronics on the cheap. The most generic, versatile, cheap, and avaliable temperature and humidity sensor on the market is the DHT11.

This sensors comes with a ±2℃ temperature accuracy and a ±5% relative humidity accuracy. WOW! All for like $2.00 per sensor. That's awesome :blush:

However, what I really don't like is how the Raspberry Pi community is obsessed with Python as it's go to programming language of choice. While Python is really easy to read and write, it's slow. Now people will really argue with me on this, but, ultimately, to ensure exact precious in timing and safety with memory, a system's level programming language is better used.

Going one step further, C or C++ is the obvious choice. However, I'm going to use a relatively new programming language: Rust.

Rust is an open sourced systems level programming language that is just as fast as C or C++ (sometimes) but uses an ownership based memory mangagment system to ensure safety from overloads and leaks.

And, I think that it's pretty easy to read. At least, I'm going to write a driver that's easy to read.

Alright, enough jib jab. Here are some resources including the DHT11 datasheet, Adafruit's Python/C implementation, and the full source code.

[DHT11 Mouser Datasheet](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf)

[Adafruit DHT Github](https://github.com/adafruit/Adafruit_Python_DHT)

[Full Driver Source Code](https://github.com/jackmead515/rust_dht11)

[Raspberry Pi GPIO Pinout](https://pinout.xyz/)

Let's start by looking at the datasheet. I'll use the sections in the datasheet and explain them one by one.

Section 5.0 describes the total amount of data that should be recieved. One cycle of reading should be 40 bits total and be the sequence of 8 bits humidity data, 8 bits humidity decimal, 8 bits temperature data, 8 bits temperature decimal, and then 8 bits containing a checksum value. It then states that the checksum value should be equal to the 4 previous values combined. Great!

Section 5.1, 5.2, and 5.3 describes the communication process. First thing we have to do is pull the DHT11 data pin high then keep it low for at least 18ms. Then, pull it high and wait 20 to 40 microseconds for the sensor to recieve the pullup and start a transmission. Next, the sensor will pull low for 80 microseconds, then high for 80 microseconds. After this, we are ready to start reading the bits from the sensor.

The data is transmitted by a series of high and low signals always starting low for 50 microseconds. After the low signal, it will pull high for a time. If the time is between 26 to 28 microseconds, the bit is 0. If the time is 70 microseconds, the bit is 1.

If the data signal is held high for too long though, the datasheet says that a communication issue has a occured and you might need to check the connections or try again.

The last bit will end with a 50 microsecond low voltage signal. After this, we should have all of our data! So let's take a breath and try to visualize the data transmission.

![data transfer](/images/dht11/data_transfer2.jpg)

It looks like the first part, where we transition from high to low, will be us programmically turning the gpio from high to low. The rest is left up to the sensor. So let's start with some code comments of the things we need to do.

```rust
// Set HIGH-LOW-HIGH start signal
// For 40 bits, capture the pulses from the sensor
// Compute the temperature, humidity, and checksum
// Validate that the data is valid from the checksum
```

So let's start with the first step (of course). There is a great cargo library in Rust called <b>rppal</b>. This is an awesome library we can use for communicating with the Raspberry Pi's GPIO bus. I won't try to reimplement a GPIO pin. That would take too much time. Further, I am going to use a wrapper struct called <b>GPIOPin</b>. This will make it just that much easier to work with the bus.

```rust
// Set HIGH-LOW-HIGH start signal
let pin = 4; // BCM Numbering
let gpio = GPIOPin::new(pin)?;

gpio.set_output();
gpio.set_high();
thread::sleep(Duration::from_millis(100));
gpio.set_low();
thread::sleep(Duration::from_millis(20));
gpio.set_high();
thread::sleep(Duration::from_micros(30));
gpio.set_input();
```

Not to bad. Straight forward. Easy to read. I picked an arbitrary amount of milliseconds to set it high initially. You will have to play around with these numbers until the sensors reads it successfully. Now, we need to attempt to read the bits from the sensors

```rust
// For 40 bits, capture the pulses from the sensor

const DHT_MAXCOUNT: usize = 32_000;
const DHT_PULSES: usize = 41;
let mut pulse_counts: [u32; DHT_PULSES*2] = [0; DHT_PULSES*2];

for i in (0..DHT_PULSES * 2).step_by(2) {
	while self.pin.is_low() {
		pulse_counts[i] += 1;
		if pulse_counts[i] >= DHT_MAXCOUNT as u32 {
			return Err(SensorError::Timeout("timed out low pulse capture".to_string()));
		}
	}
	while self.pin.is_high() {
		pulse_counts[i + 1] += 1;
		if pulse_counts[i + 1] >= DHT_MAXCOUNT as u32 {
			return Err(SensorError::Timeout("timed out high pulse capture".to_string()));
		}
	}
}
```

Alright. So, what's going on here? Well to start, the <b>DHT_MAXCOUNT</b> is a value that's going to be dependent on the platform you are running. I found that 32k works pretty nicely on the Raspberry Pi 3B. As you can see, while the pulses are oscillating back and forth, there is a potential for it to 'timeout'. How long does it take to timeout is the question. Generally, if you find a higher value to be more reliable, choose that one!

Next, the <b>DHT_PULSES</b> is the amount of pulses the sensor will give off: 40 bits! You'll see why we add one in a moment. The next variable <b>pulse_counts</b> is our array that we will use to record the low and high which should be 80 transistions total.

So in this for loop, we will record the low pulses in the even indicies and the high pulses in the odd indicies. The low pulses should be the same (around 50 microseconds, whatever that equals out to on our platform). The high pulses on the other hand should vary a lot more. We should get a higher value for a 1 and a lower value for 0. If we get a print out of the array at this point, we get something like below.

```rust
println!("{:?}", &pulse_counts[..]);

// [0, 125, 85, 37, 88, 38, 87, 113, 87, 87, 54, 113, 87, 38, 88, 37, 89, 113, 88, 39, 87, 38, 88, 38, 87, 39, 88, 37, 88, 38, 87, 38, 89, 38, 89, 38, 87, 38, 88, 39, 87, 113, 87, 38, 88, 112, 88, 112, 88, 39, 88, 38, 87, 38, 89, 37, 88, 38, 87, 38, 89, 112, 88, 38, 87, 115, 87, 38, 87, 113, 87, 38, 88, 112, 88, 38, 87, 113, 87, 38, 89, 38]
```

As you can see, we do see a pattern going on. We see a value range of 85-89, followed by a value at 39 or around 113. Looks like we are doing something right! So let's try to decode this data.

First we need a reliable number to be able to differentiate between a 0 and a 1. Now, knowing our value range, we have a data transfer that goes high between 26us and 70us and then low for 50us. I think that the average value of the lows should do nicely since it should be in the middle of the value range!

```rust
// Compute the temperature, humidity, and checksum

let mut threshold = 0;
for i in (2..DHT_PULSES * 2).step_by(2) {
  threshold += pulse_counts[i];
}
threshold /= DHT_PULSES as u32 - 1;
```

Starting with the first even index, and skipping to every following even index, we are targeting the low pulses (those values around 85-89). Then, we divide by the total amount of low pulses there should be. Basically, we just calculated the average of the low pulses! Wicked cool!!

Now, let's do some bit manipulation and calculate exactly what the sensor was trying to give us.

```rust
// Compute the temperature, humidity, and checksum

let mut data: [u8; 5] = [0; 5];
for i in (3..DHT_PULSES * 2).step_by(2) {
	let index = (i - 3) / 16;
	data[index] <<= 1;
	if pulse_counts[i] >= threshold {
		data[index] |= 1;
	}
}
```

Alright let's take this slowly... our <b>data</b> variable is an array of u8 numbers (8 bit numbers) and length 5 according to the datasheet. First we need to target the odd variables. So we start at index 3 and skip 2 after that. Easy enough. However, what is this <b>index</b> variable? This is just a smart way of computing the index we are targeting in the data array from the pulse_counts array. Since <b>5 * 16 = 40</b>, we know that as we scan across the pulse_counts array, we will insert 8 bits into the same index.

Now that we know our index, we perform a left shift on the data point in the index. A left shift will move all bits in the value to the left! Finally, we provide an if statement saying that if our current bit in the pulse_counts array is above the threshold, use the | operator to insert a 1 on the right. Okay. Let's see what the heck is going on.

```rust
// First 8 bits are at index 0;
index = 0

// Data at that index is an 8 bit integer
data[index] = [00000000]

// If our pulse_counts variable has a sequence of...
pulses = [38, 38, 113, 113, 38, 113, 113, 38]
threshold = 89

// Then here is what the first 8 loops will look like:
data[0] = [00000000]
data[0] = [00000000]
data[0] = [00000001]
data[0] = [00000011]
data[0] = [00000110]
data[0] = [00001101]
data[0] = [00011011]
data[0] = [00110110]

// That binary value to decimal is...
data[0] = 54
```

Hopefully you can see how the bits are shifted, and then a value is inserted if needed according to whether or not the pulse count value was above the threshold. (This took me a long time to figure out myself. Don't be afraid to ask questions or explore more about the how the bits are shifting).

Alright, without further ado, we can validate the checksum and calculate the values! This step is much easier. Let's just see the code.

```rust
if data[4] == data[0] + data[1] + data[2] + data[3] {
	let hint = data[0] as f32; let hdec = data[1] as f32;
	let tint = data[2] as f32; let tdec = data[3] as f32;
	let temp: f32 = tint + (tdec / 10.0);
	let humid: f32 = hint + (hdec / 10.0);

	return Ok((temp, humid));
}

return Err(SensorError::FailedRead("failed checksum validation".to_string()));
```

First we test if the checksum is equal to all the other values added up. If it is, we have our data successfully! Otherwise, we return an Err as the data we have is somehow corrupted. If we have successful data, then we pull out the individual parts.

<b>tint</b> describes the integer component of the reading, while <b>tdec</b> describes the decimal component. Seeing as how that accuracy is to the tenths place, it's just a simple conversion to get the final results <b>temp</b> and <b>humid</b>. And with that, your done!

Now, your probably wondering, how can I quickly check if what your saying is right and test it out for myself? Fair question. So below I'll explain the steps to take to install Rust on a Raspberry Pi, install the sensor, and get going. (I'll be assuming you know a fair amount about linux and programming since you made it through this entire post).

<b>Step 1.)</b><br/>Get a Raspberry Pi. It would be preferable to get a Raspberry Pi 3B or greater as it has a wifi chip.

<b>Step 2.)</b><br/>Install the Raspbian OS. It's fairly easy to do and there are plenty of resources out there to help you. In fact, your Pi probably already comes with a SD card with the OS preloaded.

<b>Step 3.)</b><br/>Enable SSH so you can remote it. If you'd prefer to not do that, plug in a keyboard, mouse and monitor!

<b>Step 4.)</b><br/>Plugin a DHT11 into BCM GPIO pin 4. Then, plug VCC into 5V and GND to GND. Use the link above to help you figure out the pin numberings.

<b>Step 5.)</b><br/>Open a terminal and install Rust by typing the following.

```bash
curl https://sh.rustup.rs -sSf | sh
```

The Rustup installer should give you a few dialog boxes. Go ahead a choose the obvious. The Rustup installer is pretty smart and automatically detects your current hardware configurations.

<b>Step 6.)</b><br/>Install git and clone the DHT11 Rust driver repository. Type in the below.

```bash
sudo apt-get install git -y && git clone https://github.com/jackmead515/rust_dht11
```

<b>Step 7.)</b><br/>Build the library, run it, and have fun!

```bash
cd rust_dht11
cargo build
sudo ./target/debug/rust_dht11
```

If you have any questions or suggestions, don't be afraid to comment below! Thank you!