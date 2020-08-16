export const pushError = (error) => {
  return {
    type: 'PUSH_ERROR',
    error
  };
};

export const popError = (id) => {
  return {
    type: 'POP_ERROR',
    id
  };
};

export const adBlockClose = () => {
  return {
    type: 'ADBLOCK_CLOSE'
  };
}

export const adBlockOpen = () => {
  return {
    type: 'ADBLOCK_OPEN'
  };
}