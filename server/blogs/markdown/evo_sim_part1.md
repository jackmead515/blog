Ever since I learned about physics, evolutionary biology, and how the two combine together to create wonderous creatures of all shapes and sizes, I've always asked myself if I have enough programming ability to be able to make a miniture version of that world within my computer.

This world would be virtually free. No matter how long I explored it, everyone elses exploration would hold something different. There would be colonies of creatures, swarms, armies, civilizations all sharing the same procedurally generated space full of vallies, rivers, lakes, mountains, caves, and oceans.

Animals would not just have to survive, they would have to adapt. They would naturally evolve to learn different survival mechanisms, some colonies of the same creatures would evolve to be seperate species. They would evolve to be able to digest different foods. If the animals didn't learn to let the forests grow, they would kill themselves. If they didn't avoid the environment, they would die from exposure.

All the while, the little explorer (the main character) could interact with the world and become apart of it. Sharing the world with the forest and the animals. Mingling with the netural creatures and avoiding the dangerous ones.

Now, this dream is obviously a huge challenge to tackle. But slowing and over a long period of time, this idea could grow into a really cool game. At this point in my career of programming (7 years), I think I'm ready to actually build this world.

## The Design

### Procedurally Generated Terrian

Just like Minecraft, probably not nearly as good, but just as beautiful. My goal for that is to create a ecosystem for the creatures, plants, and the explorer to survive and hopefully thrive.

<div style="display: flex; justify-content: center; align-items: center;">
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/evosim/terrian.png" style="max-height:50vh; width:auto; height:auto;"></img>
</div>

### Scheduled seasons with day and night cycles

In the real world, night and day means a whole lot for survival. Further, seasons can also be even worse. A colder season means less food. Creatures may learn to move less when it's cold out to not burn so much energy. 

### Plants and creatures will grow in accordance to environmental conditions

This is critical for the simulation to feel nature. If the environment, whether a boundary, weather condition, or time of day, the creature should be aware and be able to adapt.

<div style="display: flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center;">
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/evosim/forest.gif" style="max-height:50vh; width:auto; height:auto;"></img>
    <p>Forest Growth Algorithm</p>
</div>


### Plants and creatures will contain a genetic signature

Now this is fun. So, I want to code a genetic algorithm such that each feature and charactistic of a plant or creature has a signature that is slightly different from it's offspring. That way, through evolution, the creatures and plants have a way to adapt. The variables of that code are completely up to me. If I want it to be the neural network connections within a creatures brain, I can do that. Or the randomization vectors applied to the direction of a seed falling from a plant.

To top it off, that genetic code should be visible to the explorer through an interface but also through normal play. Maybe there are some creatures who have a red hue versus others that have a blue hue. 

<div style="display: flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center;">
    <img src="http://speblog-storage.s3-website-us-west-1.amazonaws.com/images/evosim/swarm.gif" style="max-height:50vh; width:auto; height:auto;"></img>
    <p>Flocking Algorithm</p>
</div>

### The little explorer shall be subjected to the same environment

Of course, the adventurer in the game will have to survive the same environment as the creatures and the plants. They will have to utilize the environment, cutting down the trees or killing the creatures, in order to gain the resources to survive.

### The program will be Python optimized with Numba, Numpy, and Rust

This is really just because of what I want to learn. Python is so cool to me because it's stupidly easy. I don't have to worry about all the things that a computer has too: overloads, memory locations, blah blah blah. 

But I know that the trade off is performance. But the open-sourced ecosystem has made it extremely easy to optimize what you need by adding in compiled Rust or C bindings, using simple decorators with Numba, or using Numpy which is a C library for computational programming.

This means I can code the stuff that doesn't really need optimization in Python and save the heavy stuff for the languages and frameworks that can handle it.

```python

// rust

#[pyclass]
pub struct Swarm {
    creatures: Vec<[f32; 7]>,
    target: [f32; 6],
    inertia_factor: f32,
    cognitive_factor: f32,
    social_factor: f32,
    swarm_group_factor: f32,
    swarm_target_factor: f32,
    swarm_random_factor: f32,
    speed: f32,
    max_speed: f32,
    best_value: f32,
    best_position: [f32; 2],
    now: Instant,
    noise: Perlin,
}

// python

import evolib as el

swarm = el.Swarm(
    target_x=width/2,
    target_y=height/2,
    inertia_factor=0.5,
    cognitive_factor=0.4,
    social_factor=0.7,
    swarm_group_factor=0.5,
    swarm_target_factor=0.8,
    swarm_random_factor=0.3,
    speed=30.0,
    max_speed=100.0,
)
```

## Conclusion

In the following months, maybe years, I'll be developing these different algorithms and sharing my process online with you all: whoever that may be. My goal is really just to learn these different algorithms to one day create the ultimate universe.

I take a lot of inspiration from Neo. But, without as good of programming skills as he has :smile:

For now, I'll see you soon. Peace.
