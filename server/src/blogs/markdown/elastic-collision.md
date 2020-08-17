Elastic collision is very basic if you understand the underlying physics. This basic algorithm takes into account two objects mass and velocity to redirect each object accordingly. If we didn't take mass into account, objects would just smash into eachother and continue travelling in there respective directions! Not very realistic...

Firstly, for extra reading reference, explore the links below. The wiki articles are jammed pack full of maths. While the OneLoneConder video is a very descriptive implementation of this. (Shout out to Mr. Coder. His video is very clear, concise, and easy to follow along)

[OneLoneCoder Circle-Circle Collision](https://www.youtube.com/watch?v=LPzyNOHY3A4)

[Elastic Collision Wiki](https://en.wikipedia.org/wiki/Elastic_collision)

[Normal Line](https://en.wikipedia.org/wiki/Normal_(geometry))

[Tangent Line](https://en.wikipedia.org/wiki/Tangent)

[Dot Product](https://en.wikipedia.org/wiki/Dot_product)

But without further ado, we can get started. For reference and convience, the full source code is below.

```javascript
function elasticCollision(obj1, obj2, damping) {
	let dx = obj2.x - obj1.x;
	let dy = obj2.y - obj1.y;
	let dr = Math.sqrt(dx * dx + dy * dy);

	let nx = dx / dr;
	let ny = dy / dr;

	let tx = -ny;
	let ty = nx;

	let dpt1 = obj1.vx * tx + obj1.vy * ty;
	let dpt2 = obj2.vx * tx + obj2.vy * ty;

	let dpn1 = obj1.vx * nx + obj1.vy * ny;
	let dpn2 = obj2.vx * nx + obj2.vy * ny;

	let m1 = (dpn1 * (obj1.mass - obj2.mass) + 2.0 * obj2.mass * dpn2) / (obj1.mass + obj2.mass);
	let m2 = (dpn2 * (obj2.mass - obj1.mass) + 2.0 * obj1.mass * dpn1) / (obj1.mass + obj2.mass);

	obj1.vx = (tx * dpt1 + nx * m1) * damping;
	obj1.vy = (ty * dpt1 + ny * m1) * damping;

	obj2.vx = (tx * dpt2 + nx * m2) * damping;
	obj2.vy = (ty * dpt2 + ny * m2) * damping;
}
```

Elastic collision makes sense, but it can be challenging when first learning it. So I will walk line by line and explain exactly what is happening and the math behind it.

To start off, the first thing to do is get the distance between the two objects.

```javascript
let dx = obj2.x - obj1.x;
let dy = obj2.y - obj1.y;
let dr = Math.sqrt(dx * dx + dy * dy);
```

If you can recognize this algorithm, you've got it! It's Pythagoras. Very simply: <b>the square root of x squared plus y squared</b>. However, <b>dx</b> and <b>dy</b> describe the edges in the x and y axises (this is why we subtract the points). Variable <b>dr</b> now describes the hypotenuse edge, or, the direct line between obj1's position and obj2's.

Now, with this information, the next step is to compute a line tangent or the normal to this edge.

```javascript
let nx = dx / dr;
let ny = dy / dr;

let tx = -ny;
let ty = nx;
```

<b>nx</b> and <b>ny</b> describe the normalization of the hypotenuse edge. Normalizing is where we basically take the magnitude of the vector in the x and y direction. These magnitudes will be numbers between 0 and 1.

<b>tx</b> and <b>ty</b> describe the normal to the edge. Meaning, this is a line perpendicular (at 90 degrees) to the hypotenuse edge.

Alright, take a breath. If any of this was difficult for you, it's about to get a bit more complicated. But not to worry, we are taking it step by step! Refer to the resources I listed at the top to go over some of the mathematical terms I went over. Don't worry, you'll get it.

For the next magic trick, we are going to compute the dot product with regard to the velocity vectors of each object using the normal and the edge. Let's see the code.

```javascript
// Dot product using the normal edge
let dpt1 = obj1.vx * tx + obj1.vy * ty;
let dpt2 = obj2.vx * tx + obj2.vy * ty;

// Dot product using the normalized edge (hypotenuse)
let dpn1 = obj1.vx * nx + obj1.vy * ny;
let dpn2 = obj2.vx * nx + obj2.vy * ny;
```

Very simply, the dot product is going to be the magnitude of the overall projection. When we compute the dot product with respect to the hypotenuse, we are actually saying <b>How much velocity is in the 'hypotenuse' direction</b>. And same thing with the normal line. We are actually saying <b>How much velocity is in the 'normal' direction</b>.

Since velocity is a vector, and we have two objects, we have essentially created two new vector describing the direction of travel in the 'normal' and 'hypotenuse' directions.

Now, we could stop here. We really have completely calculated a perfect elastic collision if each object has the same mass. We could update the objects velocities doing the following and have a wicked cool physics simulation.

```javascript
obj1.vx = tx * dpt1 + nx * dpn1;
obj1.vy = ty * dpt1 + ny * dpn1;

obj2.vx = tx * dpt2 + nx * dpn2;
obj2.vy = ty * dpt2 + ny * dpn2;
```

Sad thing is, that if obj1 is a truck, and obj2 is a mouse, the truck wouldn't completely destory the mouse. They would just kind of sadly collide and then travel more slowly in the direction of the truck... Obviously we want more from our game. So let's consider mass in the equation.

Now that we have the direction of travel, we need to know just how fast the objects should travel in there respective directions. Using the velocity and mass of each object, we can calculate for momentum. Again, code please.

```javascript
// Momentum for obj1 which respect to obj2
let m1 = (dpn1 * (obj1.mass - obj2.mass) + 2.0 * obj2.mass * dpn2) / (obj1.mass + obj2.mass);

// Momentum for obj2 with repsect to obj1
let m2 = (dpn2 * (obj2.mass - obj1.mass) + 2.0 * obj1.mass * dpn1) / (obj1.mass + obj2.mass);
```

Now, I won't begin to try to convince you that I understand the mathematics in full detail. I have throughly looked over the resources in the links above however, and, it seems as if the equations are straightforward to derive. We don't have to do that though because it's already been done! For now, we will take a leap of faith and trust that these algorithms are derived correctly. If you'd like to go and rederive them, I would highly respect that. Wizard hat for whoever does.

Now that we can consider the momentum, we can finally update the the velocity of each object by doing the following.

```javascript
obj1.vx = (tx * dpt1 + nx * m1) * damping;
obj1.vy = (ty * dpt1 + ny * m1) * damping;

obj2.vx = (tx * dpt2 + nx * m2) * damping;
obj2.vy = (ty * dpt2 + ny * m2) * damping;
```

Finally, we have a working algorithm that describes perfect elastic collision. Or does it? It reality, objects absorb some of the energy. That's where this <b>damping</b> variable comes from. Modifying this value between 0 and 1 will produce some absorption, where 0 would be complete absorption and 1 would be completely elastic.

You can experiment in this collision simulation below. There is a selectable option to convert the engine to use Javascript or WASM (which was written in Rust). The source code for both engines is in the links below. Enjoy! Please comment with any suggestions, comments, or angry messages because you can't figure it out. I'd be happy to help.

[Javascript Engine](https://github.com/jackmead515/blog/blob/master/plugins/sat-tester/src/jsengine.js)

[Rust WASM Engine](https://github.com/jackmead515/blog/blob/master/plugins/rust-wasm-sat/src/lib.rs)

<iframe id="sat-tester" width="100%" height="600" src="https://www.speblog.org/plugin/sat-tester">
</iframe>