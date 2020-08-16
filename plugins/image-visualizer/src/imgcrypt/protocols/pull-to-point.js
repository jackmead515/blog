export default class PullToPoint {
  constructor(width, height) {
    this.point = [width/2,height/2];
  }

  update(pixel, index, data) {
    const rc = this.point[0]*this.point[1];
    const rp = [data[rc], data[rc+1], data[rc+2], data[rc+3]];
    const d = Math.sqrt(Math.pow(rp[0]-pixel[0],2) +
              Math.pow(rp[1]-pixel[1],2) +
              Math.pow(rp[2]-pixel[2],2))/255*100;

    pixel[0] = d
    pixel[1] = d
    pixel[2] = d
  }
}