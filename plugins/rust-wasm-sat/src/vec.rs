pub fn subtract(v1: &[f32; 2], v2: &[f32; 2]) -> [f32; 2] {
  let n1 = v1[0] - v2[0];
  let n2 = v1[1] - v2[1];
  return [n1, n2]; 
}

pub fn normal(v: &[f32; 2]) -> [f32; 2] {
  return [-v[1], v[0]];
}

pub fn normalize(v: &[f32; 2]) -> [f32; 2] {
  let l = (v[1].exp2() + v[0].exp2()).sqrt();
  return [ v[0]/l, v[1]/l ];
}

pub fn dot(v1: &[f32; 2], v2: &[f32; 2]) -> f32 {
  let n1 = v1[0] * v2[0];
  let n2 = v1[1] * v2[1];
  return n1 + n2;
}