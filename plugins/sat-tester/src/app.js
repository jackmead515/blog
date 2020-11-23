import React, { Component } from 'react'
import * as three from 'three';
import * as d3 from 'd3';
import { dragElement } from './util';

import JSEngine from './jsengine';
import { timeHours } from 'd3';
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
const tjRects = {};

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
      damping: 1,
      fps: 0,
      d3: true,
    };

    this.animation = null;
    this.world_width = null;
    this.world_height = null;
    this.sun = null;
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.restart = this.restart.bind(this);
    this.center = this.center.bind(this);
    this.engine = null;
    this.tj = {};
  }

  componentDidMount() {
    this.loadWasm();
    this.dragGraph();
  }

  componentWillUnmount() {
    this.stop();
  }

  dragGraph() {
    const graph = document.getElementById('graph');
    if (graph) {
      dragElement(graph);
    }
  }

  async loadWasm() {
    const { Engine } = await import('rust-wasm-sat-pkg');
    RSEngine = Engine;
    this.createEngine();
  }

  restart() {
    this.stop();
    this.d3Rects = {};
    this.tjRects = {};
    this.tj = {};
    const graph = document.getElementById('graph');
    if (graph) {
      for(const child of graph.children) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'svg' || tag === 'canvas') {
          child.parentElement.removeChild(child);
        }
      }
    }
    this.createEngine();
  }

  start() {
    if (this.animation === null) {
      if (this.state.d3) {
        this.d3Loop();
      } else {
        this.tjLoop();
      }
    } 
  }

  stop() {
    if (this.animation === null) { return; }
    window.cancelAnimationFrame(this.animation);
    this.animation = null;
  }

  center() {
    const graph = document.getElementById('graph');
    if (graph) {
      graph.style.top = 'calc(-1500px + 50vh)';
      graph.style.left = 'calc(-1500px + 100vh)';
    }
  }

  createEngine() {
    if (this.state.d3) {
      this.createD3Engine();
    } else {
      return this.createTJEngine();
    }
  }

  createD3Engine() {
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
      .attr('r', 30)
      .attr('cx', this.world_width/2)
      .attr('cy', this.world_height/2);

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
        .attr('width', rect.width)
        .attr('height', rect.height)
        .attr('x', rect.x)
        .attr('y', rect.y);
    }
  }

  createTJEngine() {
    const graph = document.getElementById('graph');
    const bb = graph.getBoundingClientRect();
    this.world_width = bb.width;
    this.world_height = bb.height;
    this.tj.camera = new three.PerspectiveCamera(75,this.world_width/this.world_height,0.01,10);
    this.tj.camera.position.z = 1;
    this.tj.scene = new three.Scene();
    this.tj.renderer = new three.WebGLRenderer({ antialias: true });
    this.tj.renderer.setSize( this.world_width, this.world_height );
    graph.appendChild(this.tj.renderer.domElement);

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
      const geometry = new three.BoxGeometry( 0.2, 0.2, 0.2 );
      const material = new three.MeshNormalMaterial({color: 0x00ff00});
      const mesh = new three.Mesh( geometry, material );
      tjRects[rect.id] = mesh;
      this.tj.scene.add(mesh);
      break;
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

  d3Loop() {
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
        this.setState({ fps });
        fps = 0;
        last_fps = performance.now();
      }

      this.animation = window.requestAnimationFrame(update);
    }
    this.animation = window.requestAnimationFrame(update);
  }

  tjLoop() {
    let fps = 0;
    let last_fps = performance.now();
    let update_arr = new Array(this.state.amount);

    const update = () => {
      this.animation = window.requestAnimationFrame(update);

      this.engine.tick(update_arr);

      for (const rect of update_arr) {
        //tjRects[rect.id].rotation.x = 0.01;
        //tjRects[rect.id].rotation.y = 0.01;
      }

      fps+=1;
      if (performance.now() - last_fps > 1000) {
        this.setState({ fps });
        fps = 0;
        last_fps = performance.now();
      }

      this.tj.renderer.render(this.tj.scene, this.tj.camera);
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
        <button onClick={this.center}>
          Center
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
          {this.state.d3 ? 'D3' : 'TJ'}
          <input
            type="checkbox"
            checked={this.state.d3}
            onChange={() => this.setState({d3: !this.state.d3})}
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
        <div className="content">
          <div id="graph" />
          <span>{this.state.fps} fps | {this.state.wasm ? 'wasm' : 'js'}</span>
        </div>
      </div>
    );
  }
}
