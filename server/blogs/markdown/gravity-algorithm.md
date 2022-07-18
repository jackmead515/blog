For me, gravity was one of the simplist algorithms to implement. There isn't a whole lot too it. Following the mathematic algorithm in the wiki link below, it's surprisingly and beautifully simple.

[Newton's Law of Universal Gravitation](https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation)

For reference and convenience, here is the full algorithm implementation.

```javascript
function applyGravity(obj1, obj2, constant) {
	let ax = 0;
	let ay = 0;

	const dx = obj1.x - obj2.x;
	const dy = obj1.y - obj2.y;
	const dsq = dx * dx + dy * dy;
	const dr = Math.sqrt(dsq);

	if (dsq > 5) {
		const force = (constant * ((obj1.mass * obj2.mass) / dsq))
		ax += force * dx / dr;
		ay += force * dy / dr;
	}

	obj1.vx -= ax;
	obj1.vy -= ay;
}
```

The gravitation force is just the product of the two object's masses divided by the square of the center of masses all multipled by a constant. This constant is kind of where the fun exists. We could set it to be the actualy gravitation constant. But, in reality, gravity is a really weak force. It would take forever for our simulation to do anything.

Let's take this step by step and implement the algorithm step by step. Let's start with the first part. Just like with most of the other algorithms for collision I've implemented before, we need to get the distance between the two objects.

```javascript
const dx = obj1.x - obj2.x;
const dy = obj1.y - obj2.y;
const dsq = dx * dx + dy * dy;
const dr = Math.sqrt(dsq);
```

Using Pythagoras, this is quite simple. <b>dsq</b> is going to describe the distance squared, while, <b>dr</b> will desribe the actual length of the hypotenuse.

Since this is all the information we need, we can now apply gravity. First, we need to check if the distance is greater than some arbitrary value. Why? Well, in reality, gravity doesn't have a minimum distance to be applied. But since our simulation isn't pixel perfect, not checking for this will create some wild effects. Your objects will just go flying off of eachother. Again, not very realistic. But hey, this isn't made for rocket science, just a simple game implementation.

```javascript
if (dsq > 5) {
	const force = (constant * ((obj1.mass * obj2.mass) / dsq))
	ax += force * dx / dr;
	ay += force * dy / dr;
}
```

Following the algorithm exactly, we calculate for the force. Force at it's roots is mass multiplied by acceleration, or, mass multipled by the derivative of velocity. Further, since velocity is a vector, we will have an x and y component. It goes to follow that we need to multiply the force variable times the sin and cos of the angle of travel. The sin and cos will have the direction embed in it.

Finally, we subtract <b>ax</b> and <b>ay</b> from the velocity of the first object to update it's velocity in relation to the other object. To get a semi realistic simulation, you have to apply this algorithm for every other object in the simulation. That means <b>O(n^2)</b> time complexity! It's expensive, but, nessesary. You could of course optimize it slightly with quad tree data structures. But, that's another tutorial!

For now, here is a simulation you can play around with to see how the algorithm works. Enjoy! And don't forget to comment if you need any help at all.

<iframe id="sat-tester" width="100%" height="600" src="/plugins/sat-tester">
</iframe>