import * as wasm from './rust_wasm_bg.wasm';

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

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
* @param {Float32Array} v1
* @param {Float32Array} v2
* @returns {Float32Array}
*/
export function subtract(v1, v2) {
    var ptr0 = passArrayF32ToWasm0(v1, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArrayF32ToWasm0(v2, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    wasm.subtract(8, ptr0, len0, ptr1, len1);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    var v2 = getArrayF32FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 4);
    return v2;
}

/**
* @param {Float32Array} v
* @returns {Float32Array}
*/
export function normal(v) {
    var ptr0 = passArrayF32ToWasm0(v, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.normal(8, ptr0, len0);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    var v1 = getArrayF32FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 4);
    return v1;
}

/**
* @param {Float32Array} v
* @returns {Float32Array}
*/
export function normalize(v) {
    var ptr0 = passArrayF32ToWasm0(v, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.normalize(8, ptr0, len0);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    var v1 = getArrayF32FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 4);
    return v1;
}

/**
* @param {Float32Array} v1
* @param {Float32Array} v2
* @returns {number}
*/
export function dot(v1, v2) {
    var ptr0 = passArrayF32ToWasm0(v1, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArrayF32ToWasm0(v2, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.dot(ptr0, len0, ptr1, len1);
    return ret;
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

export const __wbg_pow_a9aaaa2ab07cb6df = typeof Math.pow == 'function' ? Math.pow : notDefined('Math.pow');

export const __wbg_sqrt_6d734f8ad44b5d94 = typeof Math.sqrt == 'function' ? Math.sqrt : notDefined('Math.sqrt');

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

