import React, { Component } from 'react'
import * as d3 from 'd3';
import moment from 'moment';
import { svg, formatPrefix } from 'd3';

export default class Soil extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount() {
    this.renderGraph();
  }

  randomReadings(now) {
    const THIRTY_MIN = 1800;

    const readings = new Array(100)
    .fill(0)
    .map(() => ({
      x: Math.random()*THIRTY_MIN + now,
      y: 650 + (Math.random() * ((800 - 650) + 1))
    }))
    .sort((a, b) => a.x - b.x);

    return {
      data: readings,
      median: 650 + (Math.random() * ((700 - 650) + 1)),
      standard_dev: Math.random()*15
    };
  }

  renderGraph() {
    const bb = d3.select(`#sgraph`).node().getBoundingClientRect();

    const now = moment().valueOf();
    const THIRTY_MIN = 1800;
    const margin = 10;

    const data = new Array(3)
      .fill(0);

    for(let i = 0; i < data.length; i++) {
      data[i] = this.randomReadings(now);
    }

    const xScale = d3.scaleLinear()
      .domain([now, now+THIRTY_MIN])
      .range([margin, bb.width-(margin)]);
    const yScale = d3.scaleLinear()
      .domain([0, 1023])
      .range([bb.height, 0]);
    
    const line = d3.line()
      .curve(d3.curveBasis)
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
    
    const svg = d3.select('#sgraph')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    
    const g = svg.append('g')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('transform', `translate(-${2}, 0)`)
    
    for(let i = 0; i < data.length; i++) {
      const readings = data[i];

      g.append('path')
        .attr('style', 'fill: none; stroke: #07d5ff; stroke-width: 1px;')
        .attr('d', line(readings.data));
      
      g.append('rect')
        .attr('style', 'fill: #a8703f; fill-opacity: 20%;')
        .attr('height', readings.standard_dev*4)
        .attr('width', bb.width-(margin*2))
        .attr('y', yScale(readings.median))
        .attr('x', margin);
    }
  }

  render() {
    return (
      <div className="s_container" id="sgraph">
      </div>
    )
  }
}
