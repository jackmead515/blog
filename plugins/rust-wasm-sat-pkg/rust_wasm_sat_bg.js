import * as wasm from './rust_wasm_sat_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
*/
export class Engine {

    static __wrap(ptr) {
        const obj = Object.create(Engine.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_engine_free(ptr);
    }
    /**
    * @param {number} world_width
    * @param {number} world_height
    * @param {number} gravity_constant
    * @param {number} damping
    * @returns {Engine}
    */
    static new(world_width, world_height, gravity_constant, damping) {
        var ret = wasm.engine_new(world_width, world_height, gravity_constant, damping);
        return Engine.__wrap(ret);
    }
    /**
    */
    reset() {
        wasm.engine_reset(this.ptr);
    }
    /**
    * @param {number} amount
    */
    generate(amount) {
        wasm.engine_generate(this.ptr, amount);
    }
    /**
    * @param {Rectangle} rect
    */
    add_rect(rect) {
        _assertClass(rect, Rectangle);
        var ptr0 = rect.ptr;
        rect.ptr = 0;
        wasm.engine_add_rect(this.ptr, ptr0);
    }
    /**
    * @param {number} damping
    */
    set_damping(damping) {
        wasm.engine_set_damping(this.ptr, damping);
    }
    /**
    * @param {boolean} enabled
    */
    set_gravity_enabled(enabled) {
        wasm.engine_set_gravity_enabled(this.ptr, enabled);
    }
    /**
    * @param {boolean} enabled
    */
    set_collision_enabled(enabled) {
        wasm.engine_set_collision_enabled(this.ptr, enabled);
    }
    /**
    * @param {boolean} enabled
    */
    set_elastic_enabled(enabled) {
        wasm.engine_set_elastic_enabled(this.ptr, enabled);
    }
    /**
    * @param {number} gravity_constant
    */
    set_gravity_constant(gravity_constant) {
        wasm.engine_set_gravity_constant(this.ptr, gravity_constant);
    }
    /**
    * @param {number} mass
    */
    set_sun_mass(mass) {
        wasm.engine_set_sun_mass(this.ptr, mass);
    }
    /**
    * @returns {Array<any>}
    */
    get_rects() {
        var ret = wasm.engine_get_rects(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Array<any>} update
    */
    tick(update) {
        try {
            wasm.engine_tick(this.ptr, addBorrowedObject(update));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class Rectangle {

    static __wrap(ptr) {
        const obj = Object.create(Rectangle.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_rectangle_free(ptr);
    }
    /**
    * @returns {number}
    */
    get id() {
        var ret = wasm.__wbg_get_rectangle_id(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set id(arg0) {
        wasm.__wbg_set_rectangle_id(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get collision() {
        var ret = wasm.__wbg_get_rectangle_collision(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set collision(arg0) {
        wasm.__wbg_set_rectangle_collision(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get width() {
        var ret = wasm.__wbg_get_rectangle_width(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set width(arg0) {
        wasm.__wbg_set_rectangle_width(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get height() {
        var ret = wasm.__wbg_get_rectangle_height(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        wasm.__wbg_set_rectangle_height(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get x() {
        var ret = wasm.__wbg_get_rectangle_x(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_rectangle_x(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        var ret = wasm.__wbg_get_rectangle_y(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_rectangle_y(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get vx() {
        var ret = wasm.__wbg_get_rectangle_vx(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set vx(arg0) {
        wasm.__wbg_set_rectangle_vx(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get vy() {
        var ret = wasm.__wbg_get_rectangle_vy(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set vy(arg0) {
        wasm.__wbg_set_rectangle_vy(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get ax() {
        var ret = wasm.__wbg_get_rectangle_ax(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set ax(arg0) {
        wasm.__wbg_set_rectangle_ax(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get ay() {
        var ret = wasm.__wbg_get_rectangle_ay(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set ay(arg0) {
        wasm.__wbg_set_rectangle_ay(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get mass() {
        var ret = wasm.__wbg_get_rectangle_mass(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set mass(arg0) {
        wasm.__wbg_set_rectangle_mass(this.ptr, arg0);
    }
}

export const __wbg_rectangle_new = function(arg0) {
    var ret = Rectangle.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbg_new_a938277eeb06668d = function() {
    var ret = new Array();
    return addHeapObject(ret);
};

export const __wbg_set_6b876172d9ae68d4 = function(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

export const __wbg_push_2bfc5fcfa4d4389d = function(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export const __wbg_random_5f96f58bd6257873 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

