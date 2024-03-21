import axios from 'axios';
import Message from '../models/Message';
import Channel from '../models/Channel';

export const sendMessage = async (message: Message, token: string) => {
  try {
    const response = await axios.post(
      '/api/messages',
      {
        text: message.text,
        username: message.user.username,
        user: message.user,
        channel: message.channel._id,
        date: message.date,
        organization: message.organization,
      },
      {
        headers: {
          'x-auth-token': token,
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getMessagesFromChannel = async (
  channel: Channel,
  token: string
) => {
  try {
    const response = await axios.get(`/api/messages/channel/${channel._id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};
