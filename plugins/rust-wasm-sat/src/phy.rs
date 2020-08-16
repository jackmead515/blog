use crate::Rectangle;

pub fn elastic_collision(rect1: &mut Rectangle, rect2: &mut Rectangle, damping: &f32) {
  let dx = rect2.x - rect1.x;
  let dy = rect2.y - rect1.y;
  let dr = (dx * dx + dy * dy).sqrt();

  let nx = dx / dr; //normal x
  let ny = dy / dr; //normal y

  let tx = -ny; //tangent x
  let ty = nx; //tangent y

  let dpt1 = rect1.vx * tx + rect1.vy * ty; //dot product of tangent
  let dpt2 = rect2.vx * tx + rect2.vy * ty;

  let dpn1 = rect1.vx * nx + rect1.vy * ny; //dot product of normal
  let dpn2 = rect2.vx * nx + rect2.vy * ny;

  let m1 = (dpn1 * (rect1.mass - rect2.mass) + 2.0 * rect2.mass * dpn2) / (rect1.mass + rect2.mass); //momentum
  let m2 = (dpn2 * (rect2.mass - rect1.mass) + 2.0 * rect1.mass * dpn1) / (rect1.mass + rect2.mass);

  rect1.vx = (tx * dpt1 + nx * m1) * damping;
  rect1.vy = (ty * dpt1 + ny * m1) * damping;

  rect2.vx = (tx * dpt2 + nx * m2) * damping;
  rect2.vy = (ty * dpt2 + ny * m2) * damping;
}

pub fn gravity(rect1: &mut Rectangle, rect2: &mut Rectangle, constant: &f32) {
  let mut ax = 0.0;
  let mut ay = 0.0;

  let dx = rect1.x-rect2.x;
  let dy = rect1.y-rect2.y;
  let dsq = dx*dx + dy*dy;
  let dr = dsq.sqrt();

  if dsq > 5.0 {
    let force = constant * ((rect1.mass * rect2.mass) / dsq);
    ax += force*dx/dr;
    ay += force*dy/dr;
  }

  rect1.vx -= ax;
  rect1.vy -= ay;
}