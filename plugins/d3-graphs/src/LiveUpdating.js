import React, { Component } from 'react'
import * as d3 from 'd3';

export default class LiveUpdating extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    const bb = d3.select(`#graph`).node().getBoundingClientRect();

    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, bb.width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([bb.height, 0]);

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
    
    svg.append('path')
      .attr('d', line(data))
    
    this.interval = setInterval(() => {
      data.pop();
      data.unshift(Math.random()*10);

      svg.selectAll('path')
        .data([data])
        .attr('d', line)
    }, 50);
  }

  render() {
    return (
      <div id="graph" style={{width: '100vw', height: '100vh'}}>
      </div>
    )
  }
}
