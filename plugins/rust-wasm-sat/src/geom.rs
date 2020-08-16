use crate::vec;
use crate::math;
use crate::Rectangle;

pub fn boundary_collide(width: &f32, height: &f32, rect: &mut Rectangle) {
  if rect.x < 0.0 {
    rect.vx = -rect.vx * 0.5;
    rect.x = 0.0;
  }
  if rect.y < 0.0 {
    rect.vy = -rect.vy * 0.5;
    rect.y = 0.0;
  }
  if rect.x+rect.width > *width {
    rect.vx = -rect.vx * 0.5;
    rect.x = width-rect.width;
  }
  if rect.y+rect.height > *height {
    rect.vy = -rect.vy * 0.5;
    rect.y = height-rect.height;
  }
}

pub fn rect_points(rect: &Rectangle) -> [[f32; 2]; 4] {
  let mut points: [[f32; 2]; 4] = [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0]];
  points[0] = [rect.x, rect.y];
  points[1] = [rect.x, rect.y + rect.height];
  points[2] = [rect.x + rect.width, rect.y + rect.height];
  points[3] = [rect.x + rect.width, rect.y];
  return points;
}

pub fn rect_edges(points: &[[f32; 2]; 4]) -> [[f32; 2]; 4] {
  let mut edges: [[f32; 2]; 4] = [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0]];
  edges[0] = vec::subtract(&points[0], &points[1]);
  edges[1] = vec::subtract(&points[1], &points[2]);
  edges[2] = vec::subtract(&points[2], &points[3]);
  edges[3] = vec::subtract(&points[3], &points[0]);
  return edges;
}

pub fn rect_center(rect: &Rectangle) -> [f32; 2] {
  return [ (rect.x + rect.width) / 2.0, (rect.y + rect.height) / 2.0 ];
}

pub fn project(axis: &[f32; 2], points: &[[f32; 2]; 4]) -> [f32; 2] {
  let dt = vec::dot(axis, &points[0]);
  let mut min = dt;
  let mut max = dt;
  for point in points {
      let d = vec::dot(axis, point);
      if d < min {
          min = d;
      } else if d > max {
          max = d;
      }
  }
  return [ min, max ];
}

pub fn sat_collision(rect1: &Rectangle, rect2: &Rectangle) -> [f32; 3] {
  let mut min_overlap = f32::MAX;
  let mut min_axis = [0.0, 0.0];
  let ps1 = rect_points(rect1);
  let ps2 = rect_points(rect2);
  let ed1 = rect_edges(&ps1);
  let ed2 = rect_edges(&ps2);

  for edge in &ed1 {
    let axis = vec::normalize(&vec::normal(edge));
    let mm1 = project(&axis, &ps1);
    let mm2 = project(&axis, &ps2);
    let overlap = math::max(&0.0, &(math::min(&mm1[1], &mm2[1]) - math::max(&mm1[0], &mm2[0])));
    if overlap == 0.0 {
      return [0.0, 0.0, 0.0];
    } else if overlap < min_overlap {
      min_overlap = overlap;
      min_axis = axis;
    }
  }
  for edge in &ed2 {
    let axis = vec::normalize(&vec::normal(edge));
    let mm1 = project(&axis, &ps1);
    let mm2 = project(&axis, &ps2);
    let overlap = math::max(&0.0, &(math::min(&mm1[1], &mm2[1]) - math::max(&mm1[0], &mm2[0])));
    if overlap == 0.0 {
      return [0.0, 0.0, 0.0];
    } else if overlap < min_overlap {
      min_overlap = overlap;
      min_axis = axis;
    }
  }

  let mtv = [ min_axis[0]*min_overlap, min_axis[1]*min_overlap ];
  let c1c2 = vec::subtract(&rect_center(rect1), &rect_center(rect2));
  if vec::dot(&min_axis, &c1c2) < 0.0 {
    return [ 1.0, -mtv[0], -mtv[1] ];
  }

  return [ 1.0, mtv[0], mtv[1] ];
}