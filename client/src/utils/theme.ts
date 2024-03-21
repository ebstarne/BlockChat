import axios from 'axios';

export const getTheme = async () => {
  try {
    const response = await axios.get('/api/theme/main');
    const theme = response.data;
    return theme;
  } catch (err) {
    console.log(err);
  }
};
