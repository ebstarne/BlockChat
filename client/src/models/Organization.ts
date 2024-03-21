import Channel from './Channel';
interface Organization {
  name: string;
  channels: Channel[];
  avatar?: string;
  theme?: string;
}

export default Organization;
