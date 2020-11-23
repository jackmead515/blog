const VecUtil = {
  subtract: (v1, v2) => [v1[0]-v2[0], v1[1]-v2[1]],
  normal: v => [-v[1], v[0]],
  normalize: v => {
    const l = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
	  return [v[0]/l, v[1]/l];
  },
  dot: (v1, v2) => v1[0]*v2[0] + v1[1]*v2[1],
};

function collideWithBoundary(width, height, rect) {
  if (rect.x < 0) {
    rect.vx = -rect.vx * 0.5;
    rect.x = 0;
  }
  if (rect.y < 0) {
    rect.vy = -rect.vy * 0.5;
    rect.y = 0;
  }
  if (rect.x+rect.width > width) {
    rect.vx = -rect.vx * 0.5;
    rect.x = width-rect.width;
  }
  if (rect.y+rect.height > height) {
    rect.vy = -rect.vy * 0.5;
    rect.y = height-rect.height;
  }
}

function getRectCenter(rect) {
  return [rect.x+rect.width/2, rect.y+rect.height/2];
}

function project(axis, points) {
  let dot = VecUtil.dot(axis, points[0]);
  let min = dot; let max = dot;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    dot = VecUtil.dot(axis, point);
    if (dot < min) {
      min = dot;
    } else if (dot > max) {
      max = dot;
    }
  }
  return [min, max];
}

function getPoints(rect) {
  const points = [];
  points.push([rect.x, rect.y]);
  points.push([rect.x, rect.y+rect.height]);
  points.push([rect.x+rect.width, rect.y+rect.height]);
  points.push([rect.x+rect.width, rect.y]);
  return points;
}

function getEdges(points) {
  const edges = [];
  for (let i = 0; i < points.length; i++) {
	  const p1 = points[i];
    const p2 = points[i + 1 === points.length ? 0 : i + 1];
    edges.push(VecUtil.subtract(p1, p2));
  }
  return edges;
}

function satCollision(rect1, rect2) {
  let minOverlap = Infinity;
  let minAxis = [0, 0];
  const points1 = getPoints(rect1);
  const points2 = getPoints(rect2);
  const edges1 = getEdges(points1);
  const edges2 = getEdges(points2);

  for (let i = 0; i < edges1.length; i++) {
    const edge = edges1[i];
    const axis = VecUtil.normalize(VecUtil.normal(edge));
    const mm1 = project(axis, points1);
    const mm2 = project(axis, points2);
    const overlap = Math.max(0, Math.min(mm1[1], mm2[1]) - Math.max(mm1[0], mm2[0]));
    if (overlap === 0) {
      return null;
    } else if (overlap < minOverlap) {
      minOverlap = overlap;
      minAxis = axis;
    }
  }
  for (let i = 0; i < edges2.length; i++) {
    const edge = edges2[i];
    const axis = VecUtil.normalize(VecUtil.normal(edge));
    const mm1 = project(axis, points1);
    const mm2 = project(axis, points2);
    const overlap = Math.max(0, Math.min(mm1[1], mm2[1]) - Math.max(mm1[0], mm2[0]));
    if (overlap === 0) {
      return null;
    } else if (overlap < minOverlap) {
      minOverlap = overlap;
      minAxis = axis;
    }
  }

  const mtv = [minAxis[0]*minOverlap, minAxis[1]*minOverlap];
  const c1c2 = VecUtil.subtract(getRectCenter(rect1), getRectCenter(rect2));
  if (VecUtil.dot(minAxis, c1c2) < 0) {
    return [-mtv[0], -mtv[1]];
  } 
  return mtv;
  
}

function applyElastic(rect1, rect2, damping) {
  const dx = rect2.x - rect1.x;
  const dy = rect2.y - rect1.y;
  const dr = Math.sqrt(dx * dx + dy * dy);

  const nx = dx / dr; //normal x
  const ny = dy / dr; //normal y

  const tx = -ny; //tangent x
  const ty = nx; //tangent y

  const dpt1 = rect1.vx * tx + rect1.vy * ty; //dot product of tangent
  const dpt2 = rect2.vx * tx + rect2.vy * ty;

  const dpn1 = rect1.vx * nx + rect1.vy * ny; //dot product of normal
  const dpn2 = rect2.vx * nx + rect2.vy * ny;

  const m1 = (dpn1 * (rect1.mass - rect2.mass) + 2.0 * rect2.mass * dpn2) / (rect1.mass + rect2.mass); //momentum
  const m2 = (dpn2 * (rect2.mass - rect1.mass) + 2.0 * rect1.mass * dpn1) / (rect1.mass + rect2.mass);

  rect1.vx = (tx * dpt1 + nx * m1) * damping;
  rect1.vy = (ty * dpt1 + ny * m1) * damping;

  rect2.vx = (tx * dpt2 + nx * m2) * damping;
  rect2.vy = (ty * dpt2 + ny * m2) * damping;
}

function applyGravity(rect1, rect2, constant) {
  let ax = 0;
  let ay = 0;

  const dx = rect1.x-rect2.x;
  const dy = rect1.y-rect2.y;
  const dsq = dx*dx + dy*dy;
  const dr = Math.sqrt(dsq);

  if (dsq > 5) {
    const force = (constant*((rect1.mass*rect2.mass)/dsq));
    ax += force*dx/dr;
    ay += force*dy/dr;
  }

  rect1.vx -= ax;
  rect1.vy -= ay;
}

export default class JSEngine {

  constructor(world_width, world_height, gravity_constant, damping) {
    this.rects = [];
    this.world_width = world_width;
    this.world_height = world_height;
    this.gravity_constant = gravity_constant;
    this.damping = damping;
    this.gravity_enabled = true;
    this.collision_enabled = true;
    this.elastic_enabled = true;
    this.sun = {
      id: 0,
      collision: false,
      width: 0.0,
      height: 0.0,
      x: world_width / 2.0, 
      y: world_height / 2.0,
      vx: 0.0, 
      vy: 0.0,
      ax: 0.0, 
      ay: 0.0,
      mass: 50.0,
    };
  }

  static new(world_width, world_height, gravity_constant, damping) {
    return new JSEngine(world_width, world_height, gravity_constant, damping);
  }

  reset() {
    this.rects = [];
  }

  generate(amount) {
    for (let i = 0; i < amount; i++) {
      const width = 5//Math.random() * 15.0 + 5.0;
      const height = 5//Math.random() * 15.0 + 5.0;
      const x = Math.random() * this.world_width;
      const y = Math.random() * this.world_height;
      const mass = width*height;
      let vx = Math.random();
      let vy = Math.random();
      if (Math.random() > 0.5) {
        vx = -vx;
      }
      if (Math.random() > 0.5) {
        vy = -vy;
      }
      this.rects.push({
        id: i,
        collision: false,
        width,
        height,
        x, 
        y,
        vx, 
        vy, 
        mass, 
        ax: 0, 
        ay: 0,
      });
    }
  }

  get_rects() {
    return this.rects;
  }

  set_damping(damping) {
    this.damping = damping;
  }

  set_gravity_enabled(enabled) {
    this.gravity_enabled = enabled;
  }

  set_collision_enabled(enabled) {
    this.collision_enabled = enabled;
  }

  set_elastic_enabled(enabled) {
    this.elastic_enabled = enabled;
  }

  set_gravity_constant(gravity_constant) {
    this.gravity_constant = gravity_constant;
  }

  set_sun_mass(mass) {
    this.sun.mass = mass;
  }

  tick(update) {
    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i];
      rect.x += rect.vx;
      rect.y += rect.vy;

      if (this.gravity_enabled) {
        applyGravity(rect, this.sun, this.gravity_constant);
      }
      
      for (let x = 0; x < this.rects.length; x++) {
        const rect2 = this.rects[x];

        if (rect2.id !== rect.id) {
          if (this.gravity_enabled) {
            applyGravity(rect, rect2, this.gravity_constant);
          }
  
          if (this.collision_enabled) {
            const col = satCollision(rect, rect2);
            if (col !== null) {
              rect.x += col[0]; rect.y += col[1];
              rect2.x -= col[0]; rect2.y -= col[1];
              // eslint-disable-next-line max-depth
              if (this.elastic_enabled) {
                applyElastic(rect, rect2, this.damping);
              }
            }
          }
        }
      }
      collideWithBoundary(this.world_width, this.world_height, rect);
      update[i] = rect;
    }
  }

}
