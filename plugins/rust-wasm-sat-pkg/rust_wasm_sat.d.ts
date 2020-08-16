/* tslint:disable */
/* eslint-disable */
/**
*/
export class Engine {
  free(): void;
/**
* @param {number} world_width 
* @param {number} world_height 
* @param {number} gravity_constant 
* @param {number} damping 
* @returns {Engine} 
*/
  static new(world_width: number, world_height: number, gravity_constant: number, damping: number): Engine;
/**
*/
  reset(): void;
/**
* @param {number} amount 
*/
  generate(amount: number): void;
/**
* @param {Rectangle} rect 
*/
  add_rect(rect: Rectangle): void;
/**
* @param {number} damping 
*/
  set_damping(damping: number): void;
/**
* @param {boolean} enabled 
*/
  set_gravity_enabled(enabled: boolean): void;
/**
* @param {boolean} enabled 
*/
  set_collision_enabled(enabled: boolean): void;
/**
* @param {boolean} enabled 
*/
  set_elastic_enabled(enabled: boolean): void;
/**
* @param {number} gravity_constant 
*/
  set_gravity_constant(gravity_constant: number): void;
/**
* @param {number} mass 
*/
  set_sun_mass(mass: number): void;
/**
* @returns {Array<any>} 
*/
  get_rects(): Array<any>;
/**
* @param {Array<any>} update 
*/
  tick(update: Array<any>): void;
}
/**
*/
export class Rectangle {
  free(): void;
/**
* @returns {number} 
*/
  ax: number;
/**
* @returns {number} 
*/
  ay: number;
/**
* @returns {boolean} 
*/
  collision: boolean;
/**
* @returns {number} 
*/
  height: number;
/**
* @returns {number} 
*/
  id: number;
/**
* @returns {number} 
*/
  mass: number;
/**
* @returns {number} 
*/
  vx: number;
/**
* @returns {number} 
*/
  vy: number;
/**
* @returns {number} 
*/
  width: number;
/**
* @returns {number} 
*/
  x: number;
/**
* @returns {number} 
*/
  y: number;
}
