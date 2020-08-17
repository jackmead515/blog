Alright this will be a short one. But an informative one. It's pretty easy to l
ook up a quick tutorial for how to create a line graph with D3.js. But what 
about a line graph that can accept new data as a live feed? Well, quick and dirty, 
check out the source code below for your copy pasta work.

[Github Source Code](https://github.com/jackmead515/blog/blob/master/plugins/d3-graphs/src/LiveUpdating.js#L15)

The prinicpals of it are extremely simple but may not be obvious to those that haven't seen it yet! Once you get the hang out it, you will be able to create dynamic ever-changing visualizations like the one just below. The visualization below is a automatically updating graph that translates a virtual sensor (configurable from your mouse) to data on the line graph.

<iframe id="capacitor-sensor" width="100%" height="400" src="/plugin/capacitor-sensor">
</iframe>

So let's start with the basics. Let's target a div element by it's ID and snatch it's width and height to create D3 scales.

```javascript
const bb = d3.select('#graph').node().getBoundingClientRect();

const xScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, bb.width]);
  
const yScale = d3.scaleLinear()
  .domain([0, 10])
  .range([bb.height, 0]);
```

Very straight forward. The getBoundingClientRect() is a neat little trick. It's not specific to D3 either. You can use the function after calling node() on any HTMLDocument.

Alright next we will create our fake data, render an SVG, create our line, and apply the data to it as a path!

```javascript
const data = new Array(100)
  .fill(0)
  .map(() => Math.random()*10);
  
const svg = d3.select('#graph')
  .append('svg')
  .attr('id', 'svg')
  .attr('width', '100%')
  .attr('height', '100%');

const line = d3.line()
  .curve(d3.curveBasis)
  .x((_, i) => xScale(i))
  .y((d) => yScale(d))

svg.append('path').attr('d', line(data))
```

Couple notes to remember is that we are applying the xScale and yScale to the data on the d3.line(). If we didn't do this, D3 would interpret it as pixels and we would get a very small graph. The next note is that we apply a path to the svg element and call 'd' to apply our line function too it. The line function will return data for our path element!

Now. That's easy. But here is the entertaining part. For simulation purposes, I am creating an interval in javascript and then generating new data every loop. Then, to apply the data, we use D3 functions to select all the path elements under the svg and call the data function on them to apply our updated data. Finally, we regenerate our line graph using the same line function.

```javascript
this.interval = setInterval(() => {
  data.pop();
  data.unshift(Math.random()*10);
  
  svg.selectAll('path')
    .data([data])
    .attr('d', line);
}, 50);
```

You see? Not bad when you see a demonstrated easy to read blog post about it. Hope you enjoyed that. Thank you all and good day. Leave any questions you have in the comments below!

<iframe id="/d3-graphs" width="100%" height="200" src="/plugin//d3-graphs">
</iframe>