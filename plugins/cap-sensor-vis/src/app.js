import React, { Component } from 'react'
import * as d3 from 'd3';

class TimedFunction {
  constructor(time, func) {
    this.func = func;
    this.time = time;
    this.start = Date.now();
  }

  execute() {
    if (Date.now() - this.start >= this.time) {
      this.start = Date.now();
      this.func();
    }
  }

  setTime(time) {
    this.time = time;
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      capacitance: 5,
      noise: 5,
      speed: 10
    };
    this.readings = [];
    this.saturation = 0;
    this.animation = null;
    this.width = null;
    this.height = null;
    this.pointSpacing = null;
    this.maxReadings = null;
    this.svg = null;
    this.text = null;
    this.line = null;
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.restart = this.restart.bind(this);
    this.read = this.read.bind(this);
    this.volts = this.volts.bind(this);
    this.readSensor = new TimedFunction(this.state.speed, this.read);
    this.updateVolts = new TimedFunction(100, this.volts);
  }

  componentDidMount() {
    this.graphReadings();
    this.graphSensor();
  }

  componentWillUnmount() {
    this.stop();
  }

  restart() {
    this.stop();
    this.readings = [];
    const svgg = document.getElementById('svgg');
    if (svgg) {
      svgg.parentNode.removeChild(svgg);
    }
    const svgs = document.getElementById('svgs');
    if (svgs) {
      svgs.parentNode.removeChild(svgs);
    }
    this.graphReadings();
    this.graphSensor();
  }

  start() {
    if(this.animation === null) { this.loop(); } 
  }

  stop() {
    if (this.animation === null) { return; }
    window.cancelAnimationFrame(this.animation);
    this.animation = null;
  }

  graphSensor() {
    const bb = d3.select(`#sensor`).node().getBoundingClientRect();
    const width = bb.width;
    const height = bb.height;

    const svg = d3.select(`#sensor`)
      .append("svg")
      .attr('id', 'svgs')
      .attr("width", width)
      .attr("height", height);

    const rect = svg.append('rect')
      .attr('fill', `#00cc99`)
      .attr('width', 0)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0);

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("opacity", 0)
      .on("mousemove", () => {
        const x = d3.event.offsetX;
        rect.attr("width", x);
        this.saturation = x / width;
      });
  }

  graphReadings() {
    const bb = d3.select(`#graph`).node().getBoundingClientRect();
    this.width = bb.width;
    this.height = bb.height;
    this.pointSpacing = 20;
    this.maxReadings = (this.width / this.pointSpacing) + 1;

    this.svg = d3.select('#graph')
      .append('svg')
      .attr('id', 'svgg')
      .attr('width', '100%')
      .attr('height', '100%');

    this.svg.append('rect')
      .attr('fill', '#ffffff')
      .attr('width', this.width)
      .attr('height', 2)
      .attr('x', 0)
      .attr('y', this.height/2);
    
    for (let x = 1; x < this.width; x++) {
      let xp = x*this.pointSpacing;
      if (xp > this.width) {
        break;
      }

      this.svg.append('rect')
      .attr('fill', '#ffffff')
      .attr('opacity', '0.2')
      .attr('width', 1)
      .attr('height', this.height)
      .attr('x', xp)
      .attr('y', 0);
    }

    for (let y = 1; y < this.height; y++) {
      let yp = y*this.pointSpacing;
      if (yp > this.height) {
        break;
      }

      this.svg.append('rect')
      .attr('fill', '#ffffff')
      .attr('opacity', '0.2')
      .attr('width', this.width)
      .attr('height', 1)
      .attr('x', 0)
      .attr('y', yp);
    }

    this.svg.append('text')
      .attr('fill', '#ffffff')
      .attr('x', 5)
      .attr('y', 20)
      .text("Cool Oscilloscope Simulation ®")
    
    this.text = this.svg.append('text')
      .attr('fill', '#ffffff')
      .attr('x', 5)
      .attr('y', 40)
      .text('')

    this.line = d3.line()
      .curve(d3.curveBasis)
      .x((d) => d.x)
      .y((d) => d.y)
    
    this.svg.append("svg:path")
      .attr("d", this.line(this.readings))
  }

  createReading() {
    const { capacitance, noise } = this.state;
    const prevReading = this.readings[this.readings.length-1];
    const h = this.height-this.height*0.1
    const rand = Math.random()*((this.height/8)*(noise/100));
    const sat = this.saturation*(h-this.height*0.1);
    let y = h + rand - sat;

    if (prevReading) {
      let py = prevReading.y;
      let dif = Math.abs(py-y);
      dif -= dif*(capacitance/100);
      if (py-y < 0) {
        y = py+(dif+(dif*0.5));
      } else {
        y = py-(dif+(dif*0.5));
      }
    }

    return {
      x: 0,
      y: y
    };
  }

  read() {
    for(let i = 0; i < this.readings.length; i++) {
      let reading = this.readings[i];
      reading.x += this.pointSpacing;
      this.readings[i] = reading;
    }
    if (this.readings.length > this.maxReadings) {
      this.readings.shift();
    }

    this.readings.push(this.createReading());

    this.svg.selectAll('path')
      .data([this.readings])
      .attr("d", this.line);
  }

  volts() {
    const reading = this.readings[this.readings.length-1];

    if (reading) {
      let t = 5 - ((reading.y/this.height) * 5)
      t = t < 0 ? 0 : t;
      this.text.text(`${t.toFixed(2)} V`)
    }
  }

  loop() {
    const update = () => {
      this.readSensor.setTime(this.state.speed);
      this.readSensor.execute();
      this.updateVolts.execute();
      this.animation = window.requestAnimationFrame(update);
    };

    this.animation = window.requestAnimationFrame(update);
  }

  render() {
    return (
      <div className="container">
        <div className="controls">
            <button onClick={this.start}>Start</button>
            <button onClick={this.stop}>Stop</button>
            <button onClick={this.restart}>Restart</button>
            <div className="check">
              <button onClick={() => this.setState({capacitance: this.state.capacitance+5>=100?99:this.state.capacitance+5})}>&#9650;</button>
              <button onClick={() => this.setState({capacitance: this.state.capacitance-5<=0?1:this.state.capacitance-5})}>&#9660;</button>
              <span>{this.state.capacitance} farads</span>
            </div>
            <div className="check">
              <button onClick={() => this.setState({noise: this.state.noise+5>=100?99:this.state.noise+5})}>&#9650;</button>
              <button onClick={() => this.setState({noise: this.state.noise-5<=0?1:this.state.noise-5})}>&#9660;</button>
              <span>{this.state.noise} dB</span>
            </div>
            <div className="check">
              <button onClick={() => this.setState({speed: this.state.speed+5>=100?99:this.state.speed+5})}>&#9650;</button>
              <button onClick={() => this.setState({speed: this.state.speed-5<=0?1:this.state.speed-5})}>&#9660;</button>
              <span>{this.state.speed} speed</span>
            </div>
        </div>
        <div id="sensor" />
        <div id="graph" />
      </div>
    )
  }
}
