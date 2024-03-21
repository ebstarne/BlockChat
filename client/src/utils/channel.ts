import axios from 'axios';
import Channel from '../models/Channel';

export const getChannels = async (token: string) => {
  try {
    const response = await axios.get('/api/channels', {
      headers: {
        'x-auth-token': token,
      },
    });
    const channels: Channel[] = response.data;
    return channels;
  } catch (err) {
    console.log(err);
  }
};
