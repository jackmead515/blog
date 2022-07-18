import React, { Component } from 'react';
import moment from 'moment';
import * as d3 from 'd3';

function clearD3Graphs(id) {
  const vv = document.getElementById(`${id}-vv`);
  const v = document.getElementById(`${id}-v`);

  if (vv) {
    vv.innerHTML = '';
  }

  if (v) {
    v.innerHTML = '';
  }
}

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 0,
    };

    this.drawn = false;
    this.vvMarker = null;
    this.vMarker = null;
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
    this.redraw();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    const width = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    this.setState({ windowWidth: width }, () => {
      this.redraw();
    });
  }

  redraw() {
    clearD3Graphs(this.props.id);
    this.drawViews();
    this.drawViewVelocity();
  }

  drawViewVelocity() {
    const { times } = this.props.stats;

    const bb = d3.select(`#${this.props.id}-vv`).node().getBoundingClientRect();
    const width = bb.width;
    const height = width/10 < 70 ? 70 : width/10;
    
    const statsD = times.map((value, index, arr) => arr[index+1] - value);
    statsD.pop();

    let newData = statsD.map((d, i) => ({
      x: times[i] + (times[i+1]-times[i])/2,
      y: d,
    }));

    const minTime = d3.min(newData, d => d.x);
    const maxTime = d3.max(newData, d => d.x);
    const minDiff = d3.min(newData, d => d.y);
    const maxDiff = d3.max(newData, d => d.y);

    newData = newData.map(d => {
      d.y = maxDiff - d.y;
      return d;
    });

    const xScale = d3.scaleLinear()
      .domain([minTime, maxTime])
      .range([0, width]);
    const rxScale = d3.scaleLinear()
      .domain([0, width])
      .range([minTime, maxTime]);
    const yScale = d3.scaleLinear()
      .domain([minDiff, maxDiff])
      .range([height-5, 0]);

    const svg = d3.select(`#${this.props.id}-vv`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));
    
    svg.append('rect')
      .attr('fill', '#030F11')
      .attr('width', width)
      .attr('height', height);
    
    const path = svg.append('g')
      .attr('stroke', '#4AF626')
      .attr('stroke-width', '2px')
      .attr('fill', 'none')
      .append('path')
      .data(newData)
      .attr('d', line(newData));

    const pbb = path.node().getBoundingClientRect();
    const ty = (height-pbb.height)/2;
    path.attr('transform', `translate(${0},${ty})`);

    const tooltip = svg.append('text')
      .attr('x', 0)
      .attr('y', height/2)
      .attr('text-anchor', 'right')
      .attr('fill', '#fff')
      .attr('font-size', '15px')
      .text('');

    this.vvMarker = svg.append('rect')
      .attr('width', 1)
      .attr('height', height)
      .attr('fill', '#ffff')
      .attr('visibility', 'hidden');
  
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('opacity', 0)
      .on('mousemove', (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        tooltip
          .attr('x', x+5)
          .attr('y', y)
          .text(new Date(rxScale(x)).toLocaleString());
        
        const toolNode = tooltip.node().getBoundingClientRect();
        if (x+toolNode.width >= width-5) {
          tooltip.attr('x', x-toolNode.width-5);
        }

        if (this.vvMarker) {
          this.vvMarker.attr('x', x);
        }
        if (this.vMarker) {
          this.vMarker.attr('x', x);
        }
      })
      .on('mouseenter', () => {
        tooltip.attr('visibility', 'visible');
        if (this.vvMarker) {
          this.vvMarker.attr('visibility', 'visible');
        }
        if (this.vMarker) {
          this.vMarker.attr('visibility', 'visible');
        }
      })
      .on('mouseout', () => {
        tooltip.attr('visibility', 'hidden');
        if (this.vvMarker) {
          this.vvMarker.attr('visibility', 'hidden');
        }
        if (this.vMarker) {
          this.vMarker.attr('visibility', 'hidden');
        }
      });
  }

  drawViews() {
    const { stats } = this.props;

    const bb = d3.select(`#${this.props.id}-v`).node().getBoundingClientRect();
    const width = bb.width;
    const height = 20;
    const minTime = d3.min(stats.times);
    const maxTime = d3.max(stats.times);
    const xScale = d3.scaleLinear()
      .domain([minTime, maxTime])
      .range([0, width]);

    const svg = d3.select(`#${this.props.id}-v`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    svg.append('rect')
      .attr('fill', '#030F11')
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('rect')
      .data(stats.times)
      .enter()
      .append('rect')
      .attr('fill', '#4AF626')
      .attr('width', 2)
      .attr('height', height)
      .attr('x', d => xScale(d))
      .append('svg:title')
      .text(d => moment(d).format('YYYY MMM DD, kk:mm'));

    this.vMarker = svg.append('rect')
      .attr('width', 1)
      .attr('height', height)
      .attr('fill', '#fff')
      .attr('visibility', 'hidden');
  
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('opacity', 0);
  }

  render() {
    const { amount } = this.props.stats;
    const { id } = this.props;

    return (
        <div className="stats">
          <p>Total Views: {amount}</p>
          <div className="graph">
            <div id={`${id}-v`} />
            <div id={`${id}-vv`} />
          </div>
        </div>
    );
  }
}