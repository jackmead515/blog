I've always hated writting any programming language that cannot directly use
pointers, references, threading, or type notation. Python and Javascript? Not my
cup of tea. Even though I do it for a job... :roll_eyes:

They have always just been... too easy, slow, and difficult to debug. 

* To easy as in, I can write the language in my sleep.
* To slow as in, I don't have any control on the level of type notation and references.
* To difficult to debug as in, console.log and print statements everywhere!! :rage:

But, thankfully, WASM came to my rescue. I immediately discovered just how fast this new language could be after I rewrote my [Physics Engine](https://www.speblog.org/plugin/sat-tester) into Rust WASM.

The results? I got a <b>20 FPS</b> boost. Yeah. 20 friggen FPS. That's quite a lot.

So, how did I do it? Well, it's quite easy actually. Whatever programming language you want to write WASM in (take your pick: Rust, C, C++, Python, Ruby, Go, and more), you can compile your source code directly into a javascript module importable within your existing javascript web framework.

In my case, I compiled Rust into WASM, then imported and referenced it in a react app, which itself is a micro-frontend. Pretty slick huh?

There is already great documentation how how you yourself can creat a Rust-WASM project. So I'll just provide you the [LINK](https://rustwasm.github.io/docs/book/) and I'll let you run wild with that.

My blog is about the optimization techniques I used boost my engine speed up so much. Let's take a look at some of biggest points.

[Rust WASM Physics Engine Source Code](https://github.com/jackmead515/blog/blob/master/plugins/rust-wasm-sat/src/lib.rs)

## References

This is one of the more obvious optimization techniques. Pass your data around as a reference until you actually need to mutate or get the data in that reference. below is the Javascript form of the dot product function vs the Rust version.

```javascript
// javascript

function dot(v1, v2) {
  return v1[0]*v2[0] + v1[1]*v2[1];
}
```

```rust
// rust

pub fn dot(v1: &[f32; 2], v2: &[f32; 2]) -> f32 {
  let n1 = v1[0] * v2[0];
  let n2 = v1[1] * v2[1];
  return n1 + n2;
}
```

Now, okay. I'll be fair here. The V8 Javascript engine will probably compile down this javascript to use references automatically in this function. It's not that dumb. But, at least in rust, we can explicitly declare the dot product function to demand the use of references.

## Type Notation

Again, another obvious technique. But, it's worth pointing out that programming languages that declare the type for which the variable is of is always faster than those that don't. The compiler already knows how to create the memory for that specific variable and doesn't waste time on having to figure it out.

```javascript
// javascript

function dot(v1, v2)
```

```rust
// rust

fn dot(v1: &[f32; 2], v2: &[f32; 2])
```

Here, Rust is like, "Alright, my dude. Your passing references to arrays of length two containing two valid 32 bit floats. Right on, brotha".

While Javascript is like, "Um... ahh.. your referencing an index.. so uh... I guess your an array? Oh wait, you could be an object I guess. Oh wait, let me check, do I need to copy the values? Crap. Your multiplying the indexes together. Must be a number. Oh crap, I guess it could be a function that needs executing..."

You see the difference? Again, the V8 engine is pretty smart. But why rely on something else when we know the best optimization techniques?

## Threading

Okay this is so cool. We can now multi-thread in the web. Whattt??? Yeah like straight up multithreading. No, I'm not talking about web workers or some other bologna. Unfortunately, Rust WASM doesn't yet have support for multithreading so I can't really talk on this topic much. But look into it in the meantime! I'll have my eyes peeled for it... :eyes:

## Copying and Cloning

This is where we start to see major optimization improvements. In Javascript, you can't really decide when a value is just a reference or if it's entire contents are copied. In Rust / WASM, we do. Let's take a look at where this concept really sees performance.

In my [Rust engine loop](https://github.com/jackmead515/blog/blob/master/plugins/rust-wasm-sat/src/lib.rs#L165), we basically have this:

```rust
for rect1 in rects {
  for rect2 in rects {
    // do stuff
  }
}
```

O(n^2) algorithm and all that junk. If I had multithreading, I could process the second loop in parallel... but I don't have that yet. Soon! But, in Rust, this for loop gets a little trick since we are looping over the same array twice.

In Rust, you can only reference a variable in one way at a time. Those ways are either by reference or mutable reference. So what I did was this:

```rust
for rect1.clone() in rects {
  for rect2.clone() in rects {
    // done the stuffss
  }
}
```

But, as any programmer might see, I am literally copying every single rectangle every single loop. If I have 200 rectangles, that's (200 * 200) = 40000 copies every engine loop!!! Not good at all. When running the engine on this technique, the Rust engine performed around 15 FPS **WORSE** then Javascript!!

So, to solve this?

```rust
for rect1.clone() in rects {
  for rect2.as_mut_ref() in rects {
    // do siffss
  }
}
```

There. I just reduced the amount of copies by 39800. Boom. And I clearly did something right. Because after this, my Rust engine went from -15 FPS to +20 FPS!! That's a 35 FPS boost! Friggen nutts! As a general rule of thumb, it's always benefical to reduce the amount of times you copy or clone your data.
Copying data is expensive.

## Array Initialization

The final technique I tried was array initialization with length. In both engines, the `tick()` function allows an update array to be passed into it. The array will be populated by the corresponding engine with the next state of the engine. Why do I do it like this?

Well, in WASM, you cannot exchange memory with the host (javascript) unless it is a number. So returning something from WASM can be a pain. If I had to do this, this means I'd have to create a javascript bound array, clone every single rectangle into it, then return it. Every single engine loop? That can get expensive real fast. 

So, when I do is just pass a preinitialized array from Javascript to WASM and set the modified cloned value to the index in which it should be. Kind of like how you read into a buffer...

```rust
let mut buffer: [u8; 5] = [0; 5];
read(buffer);
// buffer should be populated
```

In theory this should work, but I didn't really see much of a performance gain? I don't know. Not sure yet.

## Anyways...

Thanks for reading. Hope you learned something from this. If you didn't, that's okay too. But now you get to play with a cool physics simulator :smile:

Try out the WASM toggle, click Restart, and see the FPS performance gains. Peace.

<iframe id="sat-tester" width="100%" height="600" src="/plugins/sat-tester">
</iframe>

