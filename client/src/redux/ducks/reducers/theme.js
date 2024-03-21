import { GET_THEME, RESET_THEME } from '../types';

const initialState = {
  theme: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_THEME:
      return {
        ...state,
        theme: payload.palette,
        org: payload.organization,
      };
    case RESET_THEME:
      return {
        ...state,
        theme: {},
        org: '',
      };
    default:
      return state;
  }
}
