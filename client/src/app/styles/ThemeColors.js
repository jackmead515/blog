
export const RED = '#ff1a1a';
export const YELLOW = '#ffff00';
export const GREEN = '#66ff33';
export const AQUA = '#00ffff';
export const BLUE = '#0066ff';
export const VIOLET = '#cc00ff';

const colors = [
  RED,
  YELLOW,
  GREEN,
  AQUA,
  BLUE,
  VIOLET
];

export function random() {
  return colors[Math.floor(Math.random()*colors.length)];
}