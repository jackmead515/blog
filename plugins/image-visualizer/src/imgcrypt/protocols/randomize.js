export default class Randomize {

  constructor() {}

  update(pixel) {
    pixel[0] = Math.random()*255;
    pixel[1] = Math.random()*255;
    pixel[2] = Math.random()*255;
    pixel[3] = 255;
  }

}