import React, { Component } from 'react'
import leaf from 'leaflet';
import moment from 'moment';
import axios from 'axios';
import * as d3 from 'd3';

import confirmed from './confirmed.json';
import deaths from './deaths.json';
import recovered from './recovered.json';

const apiKey = "bbb5c2de-f07c-4989-add2-a92f962c9dce";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateIndex: 0,
      category: 0
    };

    this.map = null;
    this.onGoForward = this.onGoForward.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
    this.onClickDeaths = this.onClickDeaths.bind(this);
    this.onClickConfirmed = this.onClickConfirmed.bind(this);
    this.onClickRecovered = this.onClickRecovered.bind(this);
    this.markers = [];
    this.ckeys = Object.keys(confirmed)
      .map((key) => moment(key, "M/D/YY").valueOf())
      .sort()
      .map((key) => moment(key).format("M/D/YY").toString());
    this.rkeys = Object.keys(recovered)
      .map((key) => moment(key, "M/D/YY").valueOf())
      .sort()
      .map((key) => moment(key).format("M/D/YY").toString());
    this.dkeys = Object.keys(deaths)
      .map((key) => moment(key, "M/D/YY").valueOf())
      .sort()
      .map((key) => moment(key).format("M/D/YY").toString());

    // current value. Not the max.
    this.cmax = confirmed[this.ckeys[this.ckeys.length-1]].reduce((acc, record) => acc+record[1], 0);
    this.dmax = deaths[this.dkeys[this.dkeys.length-1]].reduce((acc, record) => acc+record[1], 0);
    this.rmax = recovered[this.rkeys[this.rkeys.length-1]].reduce((acc, record) => acc+record[1], 0);
    
    this.datasets = [
      this.ckeys.map((date) => {
        const count = confirmed[date].reduce((acc, record) => acc+record[1], 0);
        return { date, count };
      }),
      this.rkeys.map((date) => {
        const count = recovered[date].reduce((acc, record) => acc+record[1], 0);
        return { date, count };
      }),
      this.dkeys.map((date) => {
        const count = deaths[date].reduce((acc, record) => acc+record[1], 0);
        return { date, count };
      })
    ];
  }

  componentDidMount() {
    const tileLayer = leaf.tileLayer(
    `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${apiKey}`,
    {
      tileSize: 256,
      maxZoom: 13,
      minZoom: 2,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    this.map = leaf.map('map', {
      layers: [tileLayer]
    });

    this.map.setView([0, 0], 2);
    this.map.invalidateSize();

    this.renderCases();
    this.renderGraph();
  }

  renderGraph() {
    const { category, dateIndex } = this.state;

    const container = document.getElementById('graph');
    if (container) {
      container.innerHTML = '';
    }

    const bb = d3.select(`#graph`).node().getBoundingClientRect();
    const margin = 20;
    const width = bb.width-(2*margin);
    const height = width/10 < 100 ? 100 : width/10;
    const colors = [ '#ffb13d', '#43ff3d', '#ff0000' ];
    const texts = ['Confirmed', 'Recovered', 'Deaths'];
    const maxes = [this.cmax, this.rmax, this.dmax];
    const max = maxes[category];
    const text = texts[category];
    const color = colors[category];
    const dataset = this.datasets[category];
    const data = dataset.map(({date, count}) => {
      return { y: count, x: moment(date, "M/D/YY").valueOf() }
    });

    const minTime = data[0].x;
    const maxTime = data[data.length - 1].x;
    const minCount = d3.min(data, (d) => d.y);
    const maxCount = d3.max(data, (d) => d.y);

    const xScale = d3.scaleLinear()
      .domain([minTime, maxTime])
      .range([0, width]);
    const rxScale = d3.scaleLinear()
      .domain([0, width])
      .range([minTime, maxTime]);
    const yScale = d3.scaleLinear()
      .domain([minCount, maxCount])
      .range([height, 0]);
    const ryScale = d3.scaleLinear()
      .domain([height, 0])
      .range([minCount, maxCount]);

    const chart = d3.select(`#graph`)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))

    const area = d3.area()
      .x((d) => xScale(d.x))
      .y1((d) => yScale(d.y))
      .y0(height);
    
    chart.append('path')
      .data([data])
      .attr('class', 'graph_area')
      .attr('style', `fill: ${color};`)
      .attr('d', area);

    chart.append("g")
      .attr('class', 'graph_line')
      .attr('style', `stroke: ${color};`)
      .append('path')
      .data(data)
      .attr("d", line(data));

    chart.append('rect')
      .attr('class', 'graph_bar')
      .attr('x', xScale(data[dateIndex].x))
      .attr('y', height-10)
      .attr('width', width/data.length - 3)
      .attr('height', 10)

    const dateLabel = chart.append('text')
      .text('')
      .attr('class', 'graph_label')
      .attr('x', 0)
      .attr('y', 15)
    const amountLabel = chart.append('text')
      .text('')
      .attr('class', 'graph_label')
      .attr('x', 0)
      .attr('y', 35);
    
    chart.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('opacity', 0)
      .on('mousemove', () => {
        const x = d3.event.offsetX;
        const y = d3.event.offsetY;

        const time = moment(rxScale(x)).format('YYYY MMM, Do kk:mm');
        let amount = dataset[Math.floor(dataset.length*(x/width))];
        amount = amount ? amount.count : -1;

        dateLabel.attr('x', x+20).attr('y', y).text(time);
        amountLabel.attr('x', x+20).attr('y', y+20).text(`Total: ${amount}`);

        const node2 = amountLabel.node().getBoundingClientRect();
        const node3 = dateLabel.node().getBoundingClientRect();
        if(x+node3.width >= width-10) {
          dateLabel.attr('x', x-node3.width-10);
          amountLabel.attr('x', x-node2.width-10);
        }
      })
      .on("mouseenter", () => {
        dateLabel.attr('visibility', 'visible');
        amountLabel.attr('visibility', 'visible');
      })
      .on("mouseout", () => {
        dateLabel.attr('visibility', 'hidden');
        amountLabel.attr('visibility', 'hidden');
      });
  }

  renderCases() {
    switch(this.state.category) {
      case 0: return this.renderConfirmed();
      case 1: return this.renderRecovered();
      case 2: return this.renderDeaths();
      default: return;
    };
  }

  renderConfirmed() {
    const { dateIndex } = this.state;

    this.markers.map((m) => m.remove());
    this.markers = [];


    confirmed[this.ckeys[dateIndex]].map((record) => {
      if (record[1] > 0) {
        const c = leaf.circle(record[0], {
          color: '#ffb13d',
          fillColor: '#ffb13d',
          fillOpacity: 0.5,
          stroke: true,
          weight: 1,
          radius: record[1] / 500 * 1000
        });
        this.markers.push(c);
        c.addTo(this.map);
      }
    });
  }

  renderRecovered() {
    const { dateIndex } = this.state;

    this.markers.map((m) => m.remove());
    this.markers = [];

    recovered[this.rkeys[dateIndex]].map((record) => {
      if (record[1] > 0) {
        const c = leaf.circle(record[0], {
          color: '#43ff3d',
          fillColor: '#43ff3d',
          fillOpacity: 0.5,
          stroke: true,
          weight: 1,
          radius: record[1] / 500 * 1000
        });
        this.markers.push(c);
        c.addTo(this.map);
      }
    });
  }

  renderDeaths() {
    const { dateIndex } = this.state;

    this.markers.map((m) => m.remove());
    this.markers = [];

    deaths[this.dkeys[dateIndex]].map((record) => {
      if (record[1] > 0) {
        const c = leaf.circle(record[0], {
          color: '#ff0000',
          fillColor: '#ff0000',
          fillOpacity: 0.5,
          stroke: true,
          weight: 1,
          radius: record[1] / 500 * 5000
        });
        this.markers.push(c);
        c.addTo(this.map);
      }
    });
  }

  onGoBack() {
    const { dateIndex } = this.state;

    if (dateIndex - 1 < 0) {
      this.setState({dateIndex: 0}, () => {
        this.renderCases();
        this.renderGraph();
      });
    } else {
      this.setState({dateIndex: dateIndex-1}, () => {
        this.renderCases();
        this.renderGraph();
      });
    }
  }

  onGoForward() {
    const { dateIndex, category } = this.state;

    const datakeys = [this.ckeys, this.rkeys, this.dkeys];
    const keys = datakeys[category];

    if (dateIndex + 1 > keys.length-1) {
      this.setState({dateIndex: keys.length-1}, () => {
        this.renderCases();
        this.renderGraph();
      });
    } else {
      this.setState({dateIndex: dateIndex+1}, () => {
        this.renderCases();
        this.renderGraph();
      });
    }
  }

  onClickDeaths() {
    this.setState({category: 2, dateIndex: 0}, () => {
      this.renderCases();
      this.renderGraph();
    })
  }

  onClickConfirmed() {
    this.setState({category: 0, dateIndex: 0}, () => {
      this.renderCases();
      this.renderGraph();
    })
  }

  onClickRecovered() {
    this.setState({category: 1, dateIndex: 0}, () => {
      this.renderCases();
      this.renderGraph();
    })
  }

  renderDate() {
    const { dateIndex, category } = this.state;
    const datakeys = [this.ckeys, this.rkeys, this.dkeys];
    const keys = datakeys[category];
    const date = keys[dateIndex];
    const dateString = moment(date, "M/D/YY").format("Do, MMM YYYY");

    return (
      <div id="date">{dateString}</div>
    )
  }

  render() {
    return (
      <div className="container">
        <div className="controls">
          <div id="title">COVID-19 Cases from January to March</div>
          {this.renderDate()}
          <div className="cat-control">
            <button onClick={this.onClickDeaths}>Deaths</button>
            <button onClick={this.onClickConfirmed}>Confirmed</button>
            <button onClick={this.onClickRecovered}>Recovered</button>
          </div>
          <div className="time-control">
            <button onClick={this.onGoBack}>{"<"}</button>
            <button onClick={this.onGoForward}>{">"}</button>
          </div>
        </div>
        <div id="map" />
        <div id="graph" />
      </div>
    )
  }
}
