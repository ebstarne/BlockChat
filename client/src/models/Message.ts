import User from './User';
import Channel from './Channel';
interface Message {
  user: User;
  username: string;
  channel: Channel;
  text: string;
  date: Date;
  organization: string;
}

export default Message;
