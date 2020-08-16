mod utils;
mod vec;
mod geom;
mod math;
mod phy;

use wasm_bindgen::prelude::*;
use js_sys::Array;
use js_sys::Math::random;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Rectangle {
    pub id: u32,
    pub collision: bool,
    pub width: f32,
    pub height: f32,
    pub x: f32, 
    pub y: f32,
    pub vx: f32, 
    pub vy: f32,
    pub ax: f32, 
    pub ay: f32,
    pub mass: f32
}

#[wasm_bindgen]
pub struct Engine {
    rects: Vec<Rectangle>,
    sun: Rectangle,
    world_width: f32,
    world_height: f32,
    gravity_constant: f32,
    gravity_enabled: bool,
    collision_enabled: bool,
    elastic_enabled: bool,
    damping: f32,
}

#[wasm_bindgen]
impl Engine {

    #[wasm_bindgen]
    pub fn new(world_width: f32, world_height: f32, gravity_constant: f32, damping: f32) -> Self {
        return Engine {
            rects: Vec::new(),
            sun: Engine::new_sun(&world_width, &world_height),
            world_width,
            world_height,
            gravity_constant,
            damping,
            gravity_enabled: true,
            collision_enabled: true,
            elastic_enabled: true,
        }
    }

    fn new_sun(world_width: &f32, world_height: &f32) -> Rectangle {
        return Rectangle {
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
            mass: 50.0
        }
    }

    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.rects.clear();
    }

    #[wasm_bindgen]
    pub fn generate(&mut self, amount: u32) {
        for id in 0..amount {
            let x = random() as f32 * self.world_width;
            let y = random() as f32 * self.world_height;
            let width = random() * 15.0 + 5.0;
            let height = random() * 15.0 + 5.0;
            let mass = width * height;
            let mut vx = random();
            let mut vy = random();
            if vx > 0.5 {
                vx = -vx;
            }
            if vy > 0.5 {
                vy = -vy;
            }

            self.add_rect(Rectangle {
                id: id,
                collision: false,
                width: width as f32,
                height: height as f32,
                x: x as f32, 
                y: y as f32,
                vx: vx as f32, 
                vy: vy as f32,
                mass: mass as f32,
                ax: 0.0, 
                ay: 0.0,
            });
        }
    }
    
    #[wasm_bindgen]
    pub fn add_rect(&mut self, rect: Rectangle) {
        self.rects.push(rect);
    }

    #[wasm_bindgen]
    pub fn set_damping(&mut self, damping: f32) {
        self.damping = damping;
    }

    #[wasm_bindgen]
    pub fn set_gravity_enabled(&mut self, enabled: bool) {
        self.gravity_enabled = enabled;
    }

    #[wasm_bindgen]
    pub fn set_collision_enabled(&mut self, enabled: bool) {
        self.collision_enabled = enabled;
    }

    #[wasm_bindgen]
    pub fn set_elastic_enabled(&mut self, enabled: bool) {
        self.elastic_enabled = enabled;
    }

    #[wasm_bindgen]
    pub fn set_gravity_constant(&mut self, gravity_constant: f32) {
        self.gravity_constant = gravity_constant;
    }

    #[wasm_bindgen]
    pub fn set_sun_mass(&mut self, mass: f32) {
        self.sun.mass = mass;
    }

    #[wasm_bindgen]
    pub fn get_rects(&self) -> Array {
        let array = Array::new();

        for rect in &self.rects {
            array.push(&JsValue::from(rect.clone()));
        }

        return array;
    }

    #[wasm_bindgen]
    pub fn tick(&mut self, update: &Array) {
        let len = self.rects.len();
        let mut x = 0;

        while x < len {
            let mut y = 0;
            let mut rectm = self.rects.get(x).unwrap().clone();
            rectm.x += rectm.vx;
            rectm.y += rectm.vy;

            if self.gravity_enabled {
                phy::gravity(&mut rectm, &mut self.sun, &self.gravity_constant);
            }

            while y < len {
                let mut recto = self.rects.get_mut(y).unwrap();
                if recto.id != rectm.id {
                    if self.gravity_enabled {
                        phy::gravity(&mut rectm, &mut recto, &self.gravity_constant);
                    }
                    if self.collision_enabled {
                        let col = geom::sat_collision(&rectm, &recto);
                        if col[0] == 1.0 {
                            rectm.x += col[1]; rectm.y += col[2];
                            recto.x -= col[1]; recto.y -= col[2];
                            if self.elastic_enabled {
                                phy::elastic_collision(&mut rectm, &mut recto, &self.damping);
                            }
                        }
                    }
                }
                y += 1;
            }

            geom::boundary_collide(&self.world_width, &self.world_height, &mut rectm);
            self.rects[x] = rectm;
            update.set(x as u32, JsValue::from(rectm));
            x += 1;
        }
    }

}
