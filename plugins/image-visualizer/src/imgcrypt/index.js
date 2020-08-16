import AlphaGradient from './protocols/alpha-gradient';
import PullToPoint from './protocols/pull-to-point';
import Randomize from './protocols/randomize';

export default class ImgCrypt {
  static options = {};
  static state = {
    data: [],
    seed: '',
    canvas: null,
    context: null,
    index: 0,
    width: 0,
    height: 0
  }

  constructor(state, options) {
    this.state = { ...state };
    this.options = { ...options };

    this.state.index = 0;
    this.protos = {
      ag: new AlphaGradient(),
      pp: new PullToPoint(this.state.width, this.state.height),
      ra: new Randomize()
    }
    this.state.canvas = document.createElement('canvas');
    this.state.canvas.width = this.state.width;
    this.state.canvas.height = this.state.height;
    this.state.canvas.className = "image";
    this.state.canvas.id = "image";
    this.state.context = this.state.canvas.getContext('2d');
    this.paint();
  }

  getCanvas() {
    return this.state.canvas;
  }
  
  destroy() {
    const elem = document.getElementById('image');
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  }

  loop() {
    let done = this.perform();
    this.paint();
    return done;
  }

  perform() {
    const { data } = this.state;
    const { ag, pp, ra } = this.protos;

    for(let i = 0; i < 1000; i++) {
      const { index } = this.state;
      let pixel = [data[index], data[index+1], data[index+2], data[index+3]];

      //ra.update(pixel);
      pp.update(pixel, index, data);
      //ag.update(pixel, index, data);

      data[index] = pixel[0]; data[index+1] = pixel[1];
      data[index+2] = pixel[2]; data[index+3] = pixel[3];
      this.state.index += 4;
      this.state.data = data;
      if(this.state.index >= this.state.data.length) {
        return true;
      }
    }
    return false;
  }
  
  paint() {
    let imageData = this.state.context.createImageData(this.state.width, this.state.height);
    imageData.data.set(this.state.data);
    this.state.context.clearRect(0, 0, this.state.width, this.state.height);
    this.state.context.putImageData(imageData, 0, 0);
  }
}