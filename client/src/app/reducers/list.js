const initialState = {
  pinned: []
};

function addPin(state, head) {

  if (!state.pinned.find((h) => h.link === head.link)) {
    state.pinned.push(head);
  }

  return [ ...state.pinned ];
}

function removePin(state, link) {
  return state.pinned.filter((h) => h.link !== link);
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case 'ADD_TO_PINNED':
      return {
        ...state,
        pinned: addPin(state, action.data)
      };
    case 'REMOVED_FROM_PINNED':
      return {
        ...state,
        pinned: removePin(state, action.data)
      };
    case 'REFRESH_PINNED':
      return {
        ...state,
        pinned: action.data
      };
    default:
      return state;
  }
};