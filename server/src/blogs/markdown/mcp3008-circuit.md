You may have been refered to this blog from this complementing Rust Driver blog.

<a href="https://www.speblog.org/blog/mcp3008-analog-digital-spidev-rust-driver-raspberry-pi" alt="blog post">
    MCP3008 Rust Driver Blog
</a>

In that blog, I went over the design of a Rust driver using the SPI interface on the Raspberry Pi to communicate and read with the chip. But what about a proper circuit design?

I used to think a long time ago that electronic chips were an all inclusive package. That you don't have to worry about providing a stable voltage, modifying the resistor values, adding capacitors to reduce noise, or protecting the circuit from unwanted current or voltage spikes.

But this is absolutely not the case. And, it is definitely not the case for the MCP3008. To make sure you get the most out of your sensors, there are a few more parts you should consider adding to your circuit design.

For reference, I've included a list of all components I use and their datasheets.

| Amount | Component | Datasheet |
| :--- | :--- | :--- |
| 1 | MCP3008 ADC Converter | <a href="http://ww1.microchip.com/downloads/en/DeviceDoc/21295d.pdf" alt="datasheet">Datasheet</a> |
| 1 | MCP6004 Op Amp | <a href="http://ww1.microchip.com/downloads/en/DeviceDoc/20001733K.pdf" alt="datasheet">Datasheet</a> |
| 1 | MCP1541 4.096V Voltage Reference | <a href="http://ww1.microchip.com/downloads/en/DeviceDoc/21653C.pdf" alt="datasheet">Datasheet</a> |
| 1 | LM1084IT 5V Regulator | <a href="https://www.jameco.com/Jameco/Products/ProdDS/299743-DS01.pdf" alt="datasheet">Datasheet</a> |
| 4 | 0.1 uF ceramic capacitor | N/A |
| 2 | 1 uF electrolytic capacitor | N/A |
| 2 | 100K Ohm Potentiometer | N/A |
| 1 | Standard Photoresistor | N/A |
| 1 | Capacitive Soil Sensor | N/A |

The capacitive soil sensor and photo resistor are just two different examples of sensors I happened to have on hand for this experiment. By no means is this circuit limited to these sensors. Any other resistive or capacitive sensor can be used. If you get all the components hooked up, you'll have something that looks like this with the sensors circled in green.

<img src="https://www.speblog.org/image/mcp3008_circuit.jpg" alt="image">

Don't worry about my mess though. If you can manage to make it look cleaner, go for it! I don't actually use the MCP1541 in the picture because I got lazy. Additionally, I have everything powered from the Pi. But, since the Pi can hardly supply any current, I would highly suggest against powering anything off of it. Below is the actual schematic to use for a better guideline.

<img src="https://www.speblog.org/image/mcp3008_circuit_diagram.png" alt="image">

You will have to manually adjust the potentiometers until you get the correct voltage output you want. This all just depends on the specific sensor your using as each sensor will have different capacitance and resistance.

Now it's not perfect, but that is a much more solid MCP3008 circuit design. Two of the most important things is the **Voltage Reference** and the **Unity Gain Buffer** circuits. They provide stability and increase the accuracy of the sensors.

### Unity Gain Buffer

A unity gain buffer describes one of the ways you can hook up an op amp. Connect the negative input to the output directly. In theory, this connection has no resistance. Why would we want to do that? Here's the problem. Our sensors may have an extremely poor current output characterized by a low current voltage source and high resistance. If our soil sensor has a wire that is 10 feet long (perhaps to make it buried underground) the sensor would be doomed in trying to supply enough DC current! There is another way to say this: our circuit has **high impedance**.

And that's exactly what this circuit does. It reverses that impedance to provide an extremely low impedance. Now, when the MCP3008 needs to read the sensor reading, the signal is completely powered by the high current LM1084IT power supply and the MCP has no problem detecting it.

The op amp also doesn't care if the sensor is capacitive or resistive, as the buffer works the same for the photo resistor and soil sensor.

### Voltage Reference

Now this one may not be so obvious. The MCP3008 has two voltage inputs: VDD and VREF. VDD should just be a 5.0V signal, typically whatever your voltage source is. However, VREF requires something else. When the chip reads a sensor, it uses VREF as a reference value to make the digital conversion. And the thing about a reference, is that if it's not a stable value, your digital conversion is going to be garbage.

Tiny resistive loads on the circuit (an LED, other sensors, or wire resistance) can cause tiny flucuations in your voltage that will cause the MCP to produce values with extra error. The MCP1541 chip guarantees that our VREF will be at a very stable 4.0V no matter what else happens in the circuit.

### Capacitor Protection

<iframe id="capacitor-sensor" width="100%" height="400" src="https://www.speblog.org/plugin/capacitor-sensor">
</iframe>

One final note I want to make is the importance of all the capacitors everywhere. Adding capacitors prevents rapid voltage flucuations in your circuit which could damage your components or decrease the accuracy of your sensors. Specifically on the sensor outputs, there is a 0.1 uF ceramic capacitor pulled to ground. If you watch the output on the oscilliscope, with a cap and without, you'll notice that a capacitor will prevent the sensor from receiving a burst of information all of a sudden. Basically, you won't make the sensor less precise, you'll just make the sensor a bit more sluggish. Why would you want to do that?

Well this can help with false readings. For instance, if you have a photo resistor in your circuit that is supposed to detect if it's night out and you don't have a capacitor, very heavy cloud coverage or shadows could give false positives! In a soil sensor reading, a single drop of water on the sensor doesn't mean that the soil is moist. That drop of water could have came from anywhere. Having a large capacitor on your circuit will allow you to water your plant and wait for the water to disperse evenly before the sensor reads your soil.

For these examples, a capacitor makes sense. However, as an example, it wouldn't make sense to put capacitors on the sensor of the Large Hadron Collider. When a particle collision occurs, that collision takes place in billionths of a second! Your sensor circuit needs to be extremely sensitive and reactive to the tiny changes.

Of course, you don't have to have a capacitor. You could just use software to find the median/average value over a period of time of your choosing. But, a healthy mix of both software and hardware will make your circuit strong. To grasp this topic, I've built a small D3.js plugin to visualize this. Tune the capacitance and noise and watch how the sensor reacts. If there are any questions you have, don't be afraid to ask! Thank you!!

NOTE: This is my first official electronics tutorial and I wanted to explain how I like to write about electronics. One of the most famous books on electronics is called 'The Art of Electronics'. And I take that to heart. Design circuits is messy and takes more art and practice then math. Although I know how to do a lot of the maths (not very well) I prefer to write in terms on how I build the circuit. I understand what component does what to the circuit and then I make an educated guess as to how many units that component should be. Then, I make fine tune adjustments until it works exactly as how I'd like it too. That all being said, it is still very important to understand the mathematics involved.