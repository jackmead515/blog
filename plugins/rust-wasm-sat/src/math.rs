
pub fn max(n1: &f32, n2: &f32) -> f32 {
  let mut m = n1;
  if n2 > n1 {
    m = n2;
  }
  return *m;
}

pub fn min(n1: &f32, n2: &f32) -> f32 {
  let mut m = n1;
  if n2 < n1 {
    m = n2;
  }
  return *m;
}