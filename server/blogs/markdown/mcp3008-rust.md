Upon recieving my first Raspberry Pi, I had hardly any knowledge of electronics. I just wanted to build something cool and there was a lot of buzz going around about this amazing tiny microprocessor.

Upon understanding more, I grew a little annoyed that I couldn't hook up a simple photoresistor, soil moisture sensor, or any sort of bare bones resistive or capacitive sensor because the Pi can only read digital!!

And continuing further with my understanding, I learned that it's actually really simple with a few electronic components.

Since there is a lot of information to be learned in this tutorial, I will provide a list of outside references to learn more about the MCP3008 chip and the other electronics mentioned.

<a href="https://github.com/jackmead515/rust_mcp3008" alt="link">
    Full Driver Source Code
</a>

<a href="https://github.com/adafruit/Adafruit_CircuitPython_MCP3xxx" alt="link">
    Adafruit Python Driver Code
</a>

<a href="http://ww1.microchip.com/downloads/en/DeviceDoc/21295d.pdf" alt="link">
    MCP3008 Datasheet PDF
</a>

<a href="https://pinout.xyz/" alt="link">
    Raspberry Pi GPIO
</a>

<a href="https://www.speblog.org/blog/mcp3008-analog-digital-electronic-circuit-raspberry-pi" alt="link">
    MCP3008 Circuit Design Blog
</a>

Let's start by looking at the datasheet and creating a table of the most important features. I'm providing this as a convience list as everytime I go to hook one of these chips up, I always need reminding of at least one of these stats.

| Title | Description |
| :--- | :--- |
| Operating Voltage | 2.7V to 5.5V |
| Operating Current | 550 micro amps. Super low!! |
| Bit Resolution | 10 bits, or, a number from 0 to 1023. |
| Sampling Rate | 200 ksps / 200,000 Hz at 5V or 75 ksps / 75,000 Hz at 2.7V |
| Raspberry Pi GPIO Voltage | 3.3V max!! Otherwise, you could fry your pi. |
| 78L33 3.3V 100ma Voltage Regulator | <a href="https://pdf1.alldatasheet.com/datasheet-pdf/view/22689/STMICROELECTRONICS/L78L33C.html" alt="datasheet">Datasheet</a> |
| LD33V 3.3V 950ma Voltage Regulator | <a href="https://www.sparkfun.com/datasheets/Components/LD1117V33.pdf" alt="datasheet">Datasheet</a> |
| MCP1541 4.096V Voltage Reference | <a href="http://ww1.microchip.com/downloads/en/DeviceDoc/21653C.pdf" alt="datasheet">Datasheet</a> |
| MCP6004 1.8V - 6.0V Op Amp | <a href="http://ww1.microchip.com/downloads/en/DeviceDoc/20001733K.pdf" alt="datasheet">Datasheet</a> |

So why would I need an op amp and voltage reference? Well. Good question. And it's a good question because if your just learning how to use your MCP3008 chip from some of the other websites out there, they don't mention absolutely anything about using these components.

However, if you are reading from an analog sensor, an op amp is almost absolutely nessesary. In addition, a voltage reference is a very value chip for the sole purpose of stabilizing your voltage going into the MCP3008. These two components greatly increase the accuracy of your sensor readings.

But this tutorial is about reading the MCP3008 in Rust. So without further ado, let's get to that.

If you are trying to see a tutorial for how to implement your own SPI protocol, I apologize, this is not that tutorial. I would recommend checking out the cargo crate below we will use for this tutorial.

<a href="https://crates.io/crates/spidev" alt="link">Cargo Crate: spidev</a>

As linux already has a built in SPI interface, this crate allows us to communicate with it to read from the MCP3008.

So to start, let's look at the setup of the driver.

```rust
let channel = 5; // 0 - 7
let write = [1, 8+channel << 4, 0];
let mut read: [u8; 3] = [0; 3];
let mut transfer = SpidevTransfer::read_write(&write, &mut read);
```

Our initial write buffer is simple, First index is 1, last index is 0, and the second index is a bit mask. Let's look at the 1's and 0's

```rust
let channel = 5; // 0 - 7

// 8 + 5 = 13
0000_1000 + 0000_0101 = 0000_1101

// 13 << 4 = 208
0000_1101
1101_0000

// if channel = 0
(8 + 0) << 4 = 128
1000_0000

// if channel = 7
(8 + 7) << 4 = 240
1111_0000
```

This write message will signify to the MCP3008 that we want to read from that specific channel. The read buffer is simply going to be what the MCP replies with.

One final trick we have to worry about is activating the Chip Select pin to signal to the MCP that we are ready to read from it. According to the datasheet, the chip select can be any GPIO pin on the Raspberry Pi. We just have to manually set it low, read from the chip, then bring it back high when we are complete!

```rust
self.cs.set_low();
match self.spi.transfer(&mut transfer) {
    Ok(_) => (),
    Err(_) => return Err(Errors::FailedRead)
};
self.cs.set_high();
```

Easy enough! Now, the final crucial part is the conversion of the MCP value to it's actual resolution. Value returned from the MCP will not be set correctly. Thankfully, this is a one liner.

```rust
return Ok((((read[1] as u16) << 8) | (read[2] as u16)) & 1023);
```

Ignoring the first index of the read buffer, we grab the second number and convert it to a 16 bit unsigned integer. Whatever is originally was, the number now has twice as many bits. Then we shift all the values 8 bits over. Now, our number is shifted to the left side of the byte array. On the other side of the bitwise or operator, we do the same thing with the third index of the read buffer, but this time we apply the bitwise and operator to only keep the values in the first 10 bits of resolution. With these two values or'd together, we have our final output. Let's just look at the 1's and 0's in action.

```rust
// This is an actualy reading from a capacitive soil sensor
read[] = [0, 1, 229];

// read[1] as u16
0000_0001 -> 0000_0000_0000_0001
// << 8
0000_0000_0000_0001 -> 0000_0001_0000_0000

// read[2] as u16
1110_0101 -> 0000_0000_1110_0101
// & 1023
0000_0000_1110_0101 & 0000_0011_1111_1111 = 0000_0000_1110_0101

256 | 229 = 485
0000_0001_0000_0000 | 0000_0000_1110_0101 = 0000_0001_1110_0101
```

Hopefully you can visualize the bits moving around and taking form to get the final output! So, now you probably want to try it out for yourself. Follow the guidelines below to setup the Pi and MCP3008.

### Step 1

Get a Raspberry Pi. It would be preferable to get a Raspberry Pi 3B or greater as it has a wifi chip.

### Step 2

You will also need to get ahold of a MCP3008, a few hook up wires, breadboard, and a few capacitors if you'd like. This guide will only be a basic introduction to reading from the MCP3008, not a guide for a proper electrical design schematic.

### Step 3

Install the Raspbian OS. It's fairly easy to do and there are plenty of resources out there to help you. In fact, your Pi probably already comes with a SD card with the OS preloaded.

### Step 4

Enable SSH so you can remote in. If you'd prefer to not do that, plug in a keyboard, mouse and monitor!

### Step 5

Enable SPI communication interface on the Pi. You can do this from the raspberry pi configuration settings or by typing into a terminal the following.

```shell
sudo raspi-config
```

### Step 6

You'll probably need to reboot, but go ahead and shut the Pi off and use the MCP3008 datasheet to help you with the pins. Use the diagram below to help you to wire the MCP to the Pi.

```shell
VDD ------- 3.3V
VREF ------ 3.3V
AGND ------ Ground
CLK ------- BCM 11 (SCLK)
DOUT ------ BCM 9 (MISO)
DIN ------- BCM 10 (MOSI)
CS/SHDN --- BCM 25
DGND ------ Ground
```

### Step 7

Reboot the Pi and open a terminal and install Rust by typing the following.

```shell
curl https://sh.rustup.rs -sSf | sh
```

The Rustup installer should give you a few dialog boxes. Go ahead a choose the obvious. The Rustup installer is pretty smart and automatically detects your current hardware configurations.

### Step 8

Install git and clone the MCP3008 Rust driver repository. Type in the below.

```shell
sudo apt-get install git -y && git clone https://github.com/jackmead515/rust_mcp3008
```

### Step 9

Build the library, run it, and have fun!

```shell
cd rust_mcp3008
cargo build
sudo ./target/debug/rust_mcp3008
```

Don't worry if you cannot figure out how to setup the circuit or don't know what sensor to plug into the MCP. I didn't want to go to in depth in this tutorial as I will be releasing another blog with all of those details very clearly. Sorry if this has been an annoyance. Check out the link below for that blog! Let me know if you have any questions in the comments below!

<a href="https://www.speblog.org/blog/mcp3008-analog-digital-electronic-circuit-raspberry-pi" alt="link">
    MCP3008 Circuit Design Blog
</a>