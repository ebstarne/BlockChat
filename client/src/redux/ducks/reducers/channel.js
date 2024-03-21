import { CHANGE_CHANNEL } from '../types';

const initialState = {
  channel: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CHANGE_CHANNEL:
      return {
        ...state,
        channel: payload,
      };
    default:
      return state;
  }
}
