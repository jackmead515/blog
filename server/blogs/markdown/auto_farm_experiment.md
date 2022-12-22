I'm really excited to start writing about this. AutoFarm has been a long time project of mine and I've written so much code and have done countless hours of research.

For this post, I intend to just write about the tools, components, and programming topics that went into creating the project. They vary quite a bit so I will release a blog post about each one when I get the time :blush:

## Overview

AutoFarm is basically a name I've put onto my interest in automating the growing of plants and attempting to understand all of the ins and outs. It's not a specific tool that can be used in that way (not yet at least), but, some smaller components could very well be used in production suites that try to implement an all inclusive package. After all, I'm just one dude with a small budget and can only afford what I can get cheaply from China or from my local hardware store. I could very well deep dive into 3D printing and make some really incredible designs (I know how to use Blender decently), but, I simply don't have the space in my life right now for that. I tend to stick more with the theoretical electronics and the programming. :sweat_smile:

All that being said, what I've done is far from "junk" and I believe someone could really have a lot of fun learning and exploring with what I've created and extend it onto their own projects! After all, everything I've made is free and open source. It would just be nice if you'd mention me as your inspiration :smirk:

Okay, enough about me. Let's talk about the project. In the first section below, I'll go over the hardware I used which includes quite a bit of glue, PVC pipe, heat shrink, and plastic bins. The next section I'll go over the different circuits I have created and how I've slowly learned that an Arduino and Raspberry Pi are actually capable of more than just development units for fun. Thirdly, I'll talk about the thousands of lines of code I've written, thrown out, and cried and sighed over. Finally, I'll talk about my exploration of the data produces and what questions I've tried to explore to automate the growing even more.

## Hardware

Out of all other topics, hardware is definitely the most expensive. If I really wanted to get serious, I'd have a huge workshop where I could make metal, wood, and plastic components for specific purposes. The least I could do would be to get a 3D printer. But, unfortunately, I simply don't have the space for those things right now. I'm 24 years old and still getting my shit together!

So most of everything I've built is just PVC components glued or ziptied together. But, in reality, after spending two and a half years in a scientific laboratory working in green houses, that's really all you need to make a quality phenotyping setup. Plants are really tough. And they don't nessesarily need to be babied. They just need a predictable temperature with minimal flucations, quality lighting enough for the species, and soil and water that's rich in the nutrients that it needs. Other than that, nature has already engineered all the food making and breathing mechanisms
for us!

<details open>
<summary>Basically, my experiment that actually produced results was this...</summary>
<br>
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/autofarm/setup.png">
</details>

Not much? Yeah. I was limited in apartment space while living and working in Hawaii. My desk was actually only two feet away so I had to be careful not to roll my desk chair over the chords! lolz. But, it works. Basically, I have a small planter box where I planted 4 rows of basil, Sweet and Genova, and only had the ability to plug in 4 soil sensors into the top 2 plants of each species. The PVC pipe stand you see is just the support for the simple 1080p usb web cam I had plugged into my raspberry pi. Like I said, plants don't need a whole lot to grow well!

<details open>
<summary>As for the web cam...</summary>
<br>
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/autofarm/webcams.jpg">
</details>

It's basically just a PVC pipe with a web cam taped too it using electrical tape. I mean, can't get much simpler. However, if your project will be outside, you have to think about how to prevent humidity, water proof the casing, and try to build a heat shield to prevent the camera from being in direct sunlight. I was going to put my project outside but couldn't as I don't have any electricity outside!

Now, the sensor housing was actually kinda fun. It's another piece of PVC with more tape, yes, but it is essentially water resistant! Rain resistent anyhow... Now, there is definitely potential for water crawl up the sensor cords and threw the crevices, but as my experiment was inside, this was never put to the test.

Two temperature probes and four capacitive soil sensors all hooked up to an arduino and powered via a long USB cable. Pretty straight forward and cheap! The sensors have their length extended from some
old ethernet cable that I was able to snatch up from work.

<details open>
<summary>The sensor enclourse...</summary>
<br>
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/autofarm/sensors.jpg">
</details>

Now it's pretty clear that I am using those capacitive soil moisture sensors that you can find anywhere on Ebay or Amazon.
They are not corrosive and that was a major selling point for me. But one thing they lack is "water proof ness". How in the world could they sell this product but not make it waterproof?! But, my good friend and I came up with a pretty cheap and extremely durable way to make it water proof.

<details open>
<summary>The soil sensor...</summary>
<br>
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/autofarm/soil_sensor.jpg">
</details>

Just take some hot glue (those sticks they sell in the general store), cut small circles from the sticks and place them on top of the electronics at the top part of the sensor. Don't be stingy with the hot glue as it will become the main mechanism to make the sensor waterproof. Now, get some thick heat shrink tubing and place a small cut over the hot glue and the connector where the cords are. After that, just take your heat gun and heat it up until the hot glue gets really nice and gooey. Wait for it to dry and cut away the excess glue if there is any. And tada!! Your done! A perfectly water proofed soil sensor. I have tested it by completely submerging it underwater and leaving it out in the rain. Doesn't hurt it one bit!

But I've kind of come to a stopping point with the hardware as there isn't too much to discuss. I may very well in the future to a blog specifically only about hardware, but the 24 year old lifestyle doesn't have the time, money, or space to afford that :)

## Electronics

Now the electronics was a very long and iterative process. What I mean by that is a spent countless hours coming up with different ways to create the circuit, trying different components and different sensors and watching it behavior on my oscilloscope. What ended up working out most conviently was a simple arduino circuit with a few extra components added for stability.

<details open>
<summary>The electronic circuit...</summary>
<br>
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/autofarm/arduino.jpg">
</details>

It's just an Arduino Nano connected to a MCP6004 op-amp in a unity gain buffer configuration, with a high valued resistor on the output of the soil sensor to reduce impedance, and a capacitor in parallel with the sensor to reduce noise. In addition, I had two DS18B20 temperature probes hooked up in a one wire configuration with one as the leader and the other as the follower. I don't have a picture for that, unfortunately. But basically, the output of one one wire probe is feed into the other which is the "master" node. For convience, I've attached the circuit diagram as well.

All this can be powered from the Raspberry Pi and also read from it too via the serial protocol (which I'll get into in the software section). Previously, I had attempted to make complex circuits that the Raspberry Pi would then be able to directly read from. But that proved to be too time consuming and not as effective. I'm not an electrical engineer. And even an electrical engineer probably just would have told me to use an Arduino. The main purpose is that the ATMega chip on the Arduino already has analog inputs built in! Which makes reading the soil sensors a breeze.

I have utilized other sensors and components for different projects like a water level sensor, mechanical and solid state relays to power 120V applications, the MCP3008 to convert analog to digital signals, and even created my own circuit board online and had it printed and shipped. But, more on that in a later blog post...

## Software

All of the source code for everything related to AutoFarm can be found at my organization: [Github FreeFarmData Organization](https://github.com/freefarmdata). I firmly believe that software should be open sourced and avaliable to all those that want to use it. Free exchange of ideas is what makes progress happen. What more is software than the collective effort of a bunch of mathematical ideas?

So, with that said, I've made a LOT of software. Mostly because it's the cheapest thing to make, but also because it's what I do as a career. So I know a lot more in this topic than others. Additionally, I tried to keep it fun and use a wide range of software languages to create the application including C++, C, Rust, Javascript, Node.js, and Python. The diagram for software for this specific experiment is simple. It's just two software packages: [Auto Farm Board](https://github.com/freefarmdata/auto_farm_board) which is for the Arudino board itself, and [Auto Farm Recorder](https://github.com/freefarmdata/auto_farm_recorder) which controls the camera and reads from the Arudino storing it in an SQL database.

**auto_farm_board** is pretty simple. It's a Arduino script so it's kind of like C. It just loops every 500 milliseconds and reads from the soil sensors and temperature probes. Then, it outputs those metrics to the serial console in json format. It's really straight forward but the really fricken cool thing is that the Raspberry Pi can read from the serial console of the Arduino while powering it at the same time!

**auto_farm_recorder** had more broad of a job to do. It was responsible for not only reading from the serial console to grab what the Arduino was serving and store it in an SQL database, but it also ran a seperate thread that recorded from the USB web cam. This thread would run on an interval and check to see if it was still day light hours and capture a frame with OpenCV saving it to disk. If it wasn't day light, then it wouldn't record any images. Pretty simple app but I designed it so that it would error correct itself and I could be stress free about it operating. That is, until the PI ran out of disk space... OOPS!!

This actually became a big concern that I will talk about in the Machine Learning section. But every other day or so I would just run `scp` to download all the images to my laptop and clear them out of the PI. Was about the only thing that wasn't automatic. I could have plugged in a large USB drive and stored all the images there, or just got a bigger SD card for the PI. Regardless, it worked for the lifetime of the experiment (around 28 days).

Other than this software, I also setup Grafana and Postgres in docker containers so that I could see the sensor values live! It was a struggle to set them up. But after I figured it out, they became really convient to see how the sensors were behaving.

## Machine Learning

At the time of writing this, I'm just getting started learning about machine learning and trying to answer some questions I had about my plants. Like, in comparison from Genova to Sweet basil, which one grows faster? Or, how can I even measure the leaf foliage growth overtime? When can I expect the soil moisture to be dry and need to be watered? Or, better yet, at what rate does the soil moisture evaporate or get absorbed by the plants? Perhaps I can model this behavior in a graph on Grafana so the user can make plans to water the plants. Or even, automatically make a google calendar alarm that predicts they will have to water the plants at a given time! I mean, I have SOOO many questions about this dataset. I just don't know how to answer them quite yet.

The main task I'm working on now is exploring how I can measure the biomass or leaf foilage growth of the plant using instance segmentation to extract the plant from the image and then sum up the green pixels from a generated mask and graph it over time.

<details open>
<summary>Very exciting questions to be answered...</summary>
<br>
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/autofarm/mask_comparison.png">
</details>

But I do also want to anaylze the soil moisture to see how it behaves over time and when I can predictably say that the plants need to be watered again.

<details open>
<summary>Soil moisture values over time...</summary>
<br>
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/autofarm/soil_agged.png">
</details>

Slowly, I'll start answering these questions. And as I do, I'll write complete posts on the topic to let you all know how to do it as well.

## Conclusion

This has been a very long running experiment for me and exists as my pet project. But, it's more than just a project to me. I care deeply about agriculture and want to apply my skill set to companys and laboratories that need it. So, I almost view this as a section in my resume.

Over time I'll be releasing posts going into depth about each of the bold topics. For now, I hope that maybe your asking yourself a question or two about how you can create your own plant automation project. Stay safe. Peace.