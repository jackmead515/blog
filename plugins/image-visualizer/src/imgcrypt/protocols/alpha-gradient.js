export default class AlphaGradient {

  constructor() {}

  update(pixel, index, data) {
    const length = data.length;
    const per =(length-index)/length*255;
    pixel[3] = per;
  }

}