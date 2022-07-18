
const objectStorage = {};
let keyStore = {};

function getState(key) {
    if (key in objectStorage) {
        return objectStorage[key];
    }

    const data = JSON.parse(localStorage.getItem(key));
    objectStorage[key] = data;

    return data;
}

function setState(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    objectStorage[key] = data;
}

function setKeyConfig(key, config) {
    keyStore[key] = config;
    localStorage.setItem('__keyStore', JSON.stringify(keyStore));
}

export async function fetchState(key, ...args) {
    const keyConfig = keyStore[key];

    let data = getState(key);

    const expired = keyConfig.expiration !== undefined
        && keyConfig.loaded !== undefined
        && Date.now() - keyConfig.expiration >= keyConfig.loaded;

    if (expired || !data) {
        data = await keyConfig.load(args);

        setKeyConfig(key, { ...keyConfig, loaded: Date.now() });
        setState(key, data);
    }

    return data;
}

export function registerKey(key, loadFunction, expiration) {

    const keyConfig = keyStore[key];

    if (keyConfig) {
        keyStore[key] = {
            ...keyConfig,
            load: loadFunction,
            expiration: expiration,
        };
    } else {
        keyStore[key] = {
            load: loadFunction,
            expiration: expiration,
        };
    }

    localStorage.setItem('__keyStore', JSON.stringify(keyStore));
}

export function init() {
    const store = JSON.parse(localStorage.getItem('__keyStore'));
    if (store) {
        keyStore = {...store};
    }
}