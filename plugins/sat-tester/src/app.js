import React, { Component } from 'react'
import * as d3 from 'd3';

import JSEngine from './jsengine';
let RSEngine = null;

function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const d3Rects = {};
const d3Meta = {
  ticksPerSecond: 0,
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rects: [],
      controls: true,
      elastic: true,
      collision: true,
      gravity: true,
      wasm: false,
      amount: 20,
      sunMass: 0,
      gravityConstant: 0.0005,
      damping: 1
    };

    this.animation = null;
    this.world_width = null;
    this.world_height = null;
    this.sun = null;
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.restart = this.restart.bind(this);
    this.engine = null;
  }

  componentDidMount() {
    this.loadWasm();
  }

  componentWillUnmount() {
    this.stop();
  }

  async loadWasm() {
    const { Engine } = await import('rust-wasm-sat-pkg');
    RSEngine = Engine;
    this.createEngine();
  }

  restart() {
    this.stop();
    this.d3Rects = {};
    const svg = document.getElementById('svg');
    if (svg) {
      svg.parentNode.removeChild(svg);
    }
    this.createEngine();
  }

  start() {
    if (this.animation === null) { this.loop(); } 
  }

  stop() {
    if (this.animation === null) { return; }
    window.cancelAnimationFrame(this.animation);
    this.animation = null;
  }

  createEngine() {
    const bb = d3.select(`#graph`).node().getBoundingClientRect();
    this.world_width = bb.width;
    this.world_height = bb.height;

    const svg = d3.select('#graph')
      .append('svg')
      .attr('id', 'svg')
      .attr('width', this.world_width)
      .attr('height', this.world_height);

    this.sun = svg.append('circle')
      .attr('fill', '#ffee02')
      .attr('stroke', 'black')
      .attr('r', 10)
      .attr('cx', this.world_width/2)
      .attr('cy', this.world_height/2);

    d3Meta.ticksPerSecond = svg.append('text')
      .attr('x', 10)
      .attr('y', this.world_height - 10)
      .text(`0 fps | ${this.state.wasm ? 'wasm' : 'js'}`)

    const EngineFactory = this.state.wasm ? RSEngine : JSEngine;
    this.engine = EngineFactory.new(
      this.world_width,
      this.world_height,
      this.state.gravityConstant,
      this.state.damping
    );
    this.engine.generate(this.state.amount);

    const rects = this.engine.get_rects();

    for (const rect of rects) {
      d3Rects[rect.id] = svg.append('rect')
        .attr('fill', `${randomColor()}`)
        .attr('stroke', 'black')
        .attr('width', rect.width)
        .attr('height', rect.height)
        .attr('x', rect.x)
        .attr('y', rect.y);
    }
  }

  onChangeAmount(e) {
    let { value } = e.target;
    value = value > 0 ? value : 0;
    this.setState({ amount: value })
  }

  onChangeSunMass(e) {
    let { value } = e.target;
    value = value >= 0 ? value : 0;
    this.setState({ sunMass: value });

    if (this.engine) {
      this.engine.set_sun_mass(value);
    }
  }

  onChangeGravityConstant(e) {
    let { value } = e.target;
    value = value >= 0 ? value : 0;
    this.setState({gravityConstant: value})

    if (this.engine) {
      this.engine.set_gravity_constant(value);
    }
  }

  onChangeDamping(e) {
    let { value } = e.target;
    value = value > 0 ? value : 0;
    this.setState({damping: value})

    if (this.engine) {
      this.engine.set_damping(value);
    }
  }

  onToggleElastic() {
    const value = !this.state.elastic;
    this.setState({elastic: value});

    if (this.engine) {
      this.engine.set_elastic_enabled(value);
    }
  }

  onToggleGravity() {
    const value = !this.state.gravity;
    this.setState({gravity: value});

    if (this.engine) {
      this.engine.set_gravity_enabled(value);
    }
  }

  onToggleCollision() {
    const value = !this.state.collision;
    this.setState({collision: value});

    if (this.engine) {
      this.engine.set_collision_enabled(value);
    }
  }

  loop() {
    let fps = 0;
    let last_fps = performance.now();
    let update_arr = new Array(this.state.amount);

    const update = () => {
      this.engine.tick(update_arr);
      for (const rect of update_arr) {
        d3Rects[rect.id].attr("x", rect.x).attr("y", rect.y);
      }

      fps+=1;
      if (performance.now() - last_fps > 1000) {
        d3Meta.ticksPerSecond.text(`${fps} fps | ${this.state.wasm ? 'wasm' : 'js'}`);
        fps = 0;
        last_fps = performance.now();
      }

      this.animation = window.requestAnimationFrame(update);
    }
    this.animation = window.requestAnimationFrame(update);
  }

  renderControls() {
    return (
      <div className="controls">
        <button onClick={this.start}>
            Start
        </button>
        <button onClick={this.stop}>
          Stop
        </button>
        <button onClick={this.restart}>
          Restart
        </button>
        <div className="check">
          <p>Amount</p>
          <input
            type="number"
            style={{width: 100}}
            value={this.state.amount}
            onChange={this.onChangeAmount.bind(this)}
          />
        </div>
        <div className="check">
          <p>Sun Mass</p>
          <input
            type="number"
            style={{width: 100}}
            step="50"
            value={this.state.sunMass}
            onChange={this.onChangeSunMass.bind(this)}
          />
        </div>
        <div className="check">
          <p>G Constant</p>
          <input
            type="number"
            step="0.0001"
            style={{width: 100}}
            value={this.state.gravityConstant}
            onChange={this.onChangeGravityConstant.bind(this)}
          />
        </div>
        <div className="check">
          <p>Damping</p>
          <input
            type="number"
            step="0.001"
            style={{width: 100}}
            value={this.state.damping}
            onChange={this.onChangeDamping.bind(this)}
          />
        </div>
        <div className="check">
          WASM
          <input
            type="checkbox"
            checked={this.state.wasm}
            onChange={() => this.setState({wasm: !this.state.wasm})}
          />
        </div>
        <div className="check">
          Elastic
          <input
            type="checkbox"
            checked={this.state.elastic}
            onChange={this.onToggleElastic.bind(this)}
          />
        </div>
        <div className="check">
          Gravity
          <input
            type="checkbox"
            checked={this.state.gravity}
            onChange={this.onToggleGravity.bind(this)}
          />
        </div>
        <div className="check">
          Collision
          <input
            type="checkbox"
            checked={this.state.collision}
            onChange={this.onToggleCollision.bind(this)}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        {this.renderControls()}
        <div id="graph" />
      </div>
    );
  }
}
