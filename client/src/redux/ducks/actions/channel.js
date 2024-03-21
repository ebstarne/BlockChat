import { CHANGE_CHANNEL } from '../types';
// change the current
export const changeChannel = (channel) => (dispatch) => {
  dispatch({
    type: CHANGE_CHANNEL,
    payload: channel,
  });
};
