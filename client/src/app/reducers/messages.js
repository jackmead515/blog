const initialState = {
  errors: [],
  adblock: true,
  lastblock: null
};

export const pushError = (state, error) => {
  const errors = state.errors;
  const id = Math.floor(Math.random()*10000);

  errors.push({
    id,
    message: error
  });

  return [...errors];
};

export const popError = (state, id) => {
  const errors = state.errors.filter((err) => err.id !== id);
  return [...errors];
};


export default (state = initialState, action = {}) => {
  switch(action.type) {
    case 'PUSH_ERROR':
      return {
        ...state,
        errors: pushError(state, action.error)
      };
    case 'POP_ERROR':
      return {
        ...state,
        errors: popError(state, action.id)
      };
    case 'ADBLOCK_CLOSE':
      return {
        ...state,
        adblock: false,
        lastblock: new Date()
      };
    case 'ADBLOCK_OPEN':
      return {
        ...state,
        adblock: true,
        lastblock: null
      };
    default:
      return state;
  }
};