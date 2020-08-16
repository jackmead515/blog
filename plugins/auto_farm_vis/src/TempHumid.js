import React, { Component } from 'react'
import * as d3 from 'd3';
import moment from 'moment';

export default class TempHumid extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount() {
    this.renderGraph();
  }

  renderGraph() {
    const bb = d3.select(`#thgraph`).node().getBoundingClientRect();

    const now = moment().valueOf();
    const THIRTY_MIN = 1800;
    const lineMargin = 20;

    const temp = new Array(100)
      .fill(0)
      .reduce((arr) => {
        arr.push({
          x: Math.random()*THIRTY_MIN + now,
          y: Math.random()*50
        });
        return arr;
      }, [])
      .sort((a, b) => a.x - b.x);
    
    const humid = new Array(100)
      .fill(0)
      .reduce((arr) => {
        arr.push({
          x: Math.random()*THIRTY_MIN + now,
          y: Math.random()*100
        });
        return arr;
      }, [])
      .sort((a, b) => a.x - b.x);

    const xScale = d3.scaleLinear()
      .domain([now, now+THIRTY_MIN])
      .range([lineMargin*2, bb.width-lineMargin*2]);
    const tyScale = d3.scaleLinear()
      .domain([0, 50])
      .range([bb.height-lineMargin, lineMargin]);
    const hyScale = d3.scaleLinear()
      .domain([0, 100])
      .range([bb.height-lineMargin, lineMargin]);

    const taxis = d3.axisLeft(tyScale)
      .ticks(5)
      .tickFormat((d) => `${d}C`);
    const haxis = d3.axisRight(hyScale)
      .ticks(5)
      .tickFormat((d) => `${d}%`);
    const timeAxis = d3.axisBottom(xScale)
      .ticks(3)
      .tickFormat((d) => moment(d).format('MMM, Do kk:mm'));

    const tempLine = d3.line()
      .curve(d3.curveBasis)
      .x((d) => xScale(d.x))
      .y((d) => tyScale(d.y))
    const humidLine = d3.line()
      .curve(d3.curveBasis)
      .x((d) => xScale(d.x))
      .y((d) => hyScale(d.y))
    
    const svg = d3.select('#thgraph')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    const g = svg.append('g')
      .attr('width', bb.width-10)
      .attr('height', bb.height-10)
      .attr('transform', 'translate(10,5)')

    g.append('path')
      .attr('style', 'fill: none; stroke: #ff0000; stroke-width: 1.5px;')
      .attr('transform', 'translate(-10,0)')
      .attr('d', tempLine(temp));

    g.append('path')
      .attr('style', 'fill: none; stroke: #004cff; stroke-width: 1.5px;')
      .attr('transform', 'translate(-10,0)')
      .attr('d', humidLine(humid));

    g.append('g')
      .attr('transform', 'translate(25,0)')
      .attr('class', 'th_axis')
      .attr('style', 'color: #ff0000;')
      .call(taxis)
      .append('g')
      .attr('transform', `translate(${bb.width-75},0)`)
      .attr('class', 'th_axis')
      .attr('style', 'color: #004cff;')
      .call(haxis)
      .append('g')
      .attr('transform', `translate(${-bb.width+40},${bb.height-30})`)
      .attr('class', 'th_axis')
      .attr('style', 'color: #000;')
      .call(timeAxis);
  }

  render() {
    return (
      <div className="th_container" id="thgraph">
      </div>
    )
  }
}
