import { GET_THEME, RESET_THEME } from '../types';

// Choose org
export const chooseTheme = (theme) => async (dispatch) => {
  try {
    dispatch({
      type: GET_THEME,
      payload: theme,
    });
  } catch (err) {
    console.error(err);
  }
};

// Choose org
export const resetTheme = () => async (dispatch) => {
  try {
    dispatch({
      type: RESET_THEME,
    });
  } catch (err) {
    console.error(err);
  }
};
