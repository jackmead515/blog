import React, { Component } from 'react'
import moment from 'moment';
import * as d3 from 'd3';

import { getBlogList, getBlogStats } from '../services';
import { Modes } from '../models';

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
      stats: [],
      listings: [],
      count: 0,
      loading: false,
      blog: null,
      editedBlog: null,
      windowWidth: 0
    }
    
    this.vvMarker = null;
    this.vMarker = null;
    this.id = `stats-${Math.floor(Math.random()*10000)}`;
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentWillMount() {
    this.fetchBlogList();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentDidUpdate(prevProps, prevState) {
    const { editedBlog, windowWidth, loading, stats, listings } = this.state;
    if (this.props.mode !== Modes.EDIT && editedBlog && (!prevState.blog || (prevState.blog.link !== editedBlog))) {
      const blog = listings.find((listing) => listing.link === editedBlog);
      this.setState({ blog: blog }, () => {
        this.fetchStats();
      });
    }

    if ((!loading && prevState.loading) || (prevState.windowWidth && windowWidth)) {
      if (stats.length > 5) {
        clearD3Graphs(this.id);
        this.drawViews();
        this.drawViewVelocity();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    const width = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    this.setState({ windowWidth: width });
  }

  async fetchStats() {
    const { blog } = this.state;
    if (blog) {
      this.setState({ loading: true }, async () => {
        const { historic, count } = await getBlogStats(blog.link);
        this.setState({ loading: false, stats: historic, count, loading: false });
      });
    }
  }

  async fetchBlogList() {
    const data = await getBlogList();
    this.setState({
      listings: this.state.listings.concat(data)
    });
  }

  drawViewVelocity() {
    const { stats } = this.state;

    const bb = d3.select(`#${this.id}-vv`).node().getBoundingClientRect();
    const width = bb.width;
    const height = bb.height-10;
    
    const statsD = stats.map((value, index, arr) => arr[index+1] - value);
    statsD.pop();

    let newData = statsD.map((d, i) => {
      return {
        x: stats[i] + (stats[i+1]-stats[i])/2,
        y: d
      }
    });

    const minTime = d3.min(newData, (d) => d.x);
    const maxTime = d3.max(newData, (d) => d.x);
    const minDiff = d3.min(newData, (d) => d.y);
    const maxDiff = d3.max(newData, (d) => d.y);

    newData = newData.map((d) => {
      d.y = maxDiff - d.y;
      return d;
    })

    const xScale = d3.scaleLinear()
      .domain([minTime, maxTime])
      .range([0, width]);
    const rxScale = d3.scaleLinear()
    .domain([0, width])
    .range([minTime, maxTime]);
    const yScale = d3.scaleLinear()
      .domain([minDiff, maxDiff])
      .range([height-5, 0]);

    const svg = d3.select(`#${this.id}-vv`)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
    
    svg.append('rect')
      .attr('fill', '#f2f2f2')
      .attr('stroke', '#cccccc')
      .attr('stroke-width', '1px')
      .attr('width', width)
      .attr('height', height);
    
    const path = svg.append("g")
      .attr('class', 'graph_line')
      .append('path')
      .data(newData)
      .attr("d", line(newData))

    const pbb = path.node().getBoundingClientRect()
    const ty = (height-pbb.height)/2;
    path.attr('transform', `translate(${0},${ty})`)

    const tooltip = svg.append('text')
      .attr('x', 0)
      .attr('y', height/2)
      .attr('text-anchor', 'right')
      .attr('fill', '#404040')
      .attr('font-size', '15px')
      .text('')

    this.vvMarker = svg.append('rect')
      .attr("width", 1)
      .attr("height", height)
      .attr('fill', '#404040')
      .attr("visibility", 'hidden');
  
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("opacity", 0)
      .on("mousemove", () => {
        const x = d3.event.offsetX;
        const y = d3.event.offsetY;
        tooltip
          .attr('x', x+5)
          .attr('y', y)
          .text(moment(rxScale(x)).format('YYYY MMM, Do kk:mm'))
        
        const toolNode = tooltip.node().getBoundingClientRect();
        if(x+toolNode.width >= width-5) {
          tooltip.attr('x', x-toolNode.width-5);
        }

        if(this.vvMarker) {
          this.vvMarker.attr("x", x);
        }
        if(this.vMarker) {
          this.vMarker.attr("x", x);
        }
      })
      .on("mouseenter", () => {
        tooltip.attr('visibility', 'visible');
        if(this.vvMarker) {
          this.vvMarker.attr("visibility", 'visible');
        }
        if(this.vMarker) {
          this.vMarker.attr("visibility", 'visible');
        }
      })
      .on("mouseout", () => {
        tooltip.attr('visibility', 'hidden');
        if(this.vvMarker) {
          this.vvMarker.attr("visibility", 'hidden');
        }
        if(this.vMarker) {
          this.vMarker.attr("visibility", 'hidden');
        }
      });
  }

  drawViews() {
    const { stats } = this.state;

    const bb = d3.select(`#${this.id}-v`).node().getBoundingClientRect();
    const width = bb.width;
    const height = bb.height;
    const minTime = d3.min(stats);
    const maxTime = d3.max(stats);
    const xScale = d3.scaleLinear()
      .domain([minTime, maxTime])
      .range([ 0, width ]);

    const svg = d3.select(`#${this.id}-v`)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    svg.append('rect')
      .attr('fill', '#f2f2f2')
      .attr('stroke', '#cccccc')
      .attr('stroke-width', '1px')
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('rect')
      .data(stats)
      .enter()
      .append("rect")
      .attr("fill", "#00cc99")
      .attr("width", 2)
      .attr("height", height)
      .attr("x", (d) => xScale(d))
      .append('svg:title')
      .text((d) => moment(d).format("YYYY MMM DD, kk:mm"));

    this.vMarker = svg.append('rect')
      .attr("width", 1)
      .attr("height", height)
      .attr('fill', '#404040')
      .attr("visibility", 'hidden');
  
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("opacity", 0);
  }

  renderEdit() {
    const { mode } = this.props;
    const { listings } = this.state;

    if (mode === Modes.EDIT) {
      return (
        <div className="edit">
          <select
            value={this.state.editedBlog ? this.state.editedBlog : ''}
            onChange={(e) => this.setState({ editedBlog: e.target.value })}
          > 
            <option value="" defaultValue="" disabled> 
              Select A Blog
            </option>
            {listings.map((listing, i) => {
              return (
                <option
                  key={i}
                  value={listing.link}
                >
                  {listing.title}
                </option>
              )
            })}
          </select>
        </div>
      )
    }
  }

  renderContent() {
    const { blog, loading } = this.state;

    const spinner = loading ? <div className="spinner" /> : null;

    return (
      <div className="blog-stats">
        <h3>{blog ? blog.title : 'No Blog Selected'}{spinner}</h3>
        <div>
          <div id={`${this.id}-v`} />
          <div id={`${this.id}-vv`} />
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderEdit()}
        {this.renderContent()}
      </>
    )
  }
}