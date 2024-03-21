import React, { useEffect, useState, useRef } from 'react';
// material ui
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import ListItemText from '@material-ui/core/ListItemText';
// our stuff
import messageRow from '../components/messageRow';
import SendMessageArea from '../components/SendMessageArea';
import NavBar from '../components/NavBar';

import { Redirect } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
// pictures
import state from '../assets/state.png';
// state-changing api calls
import { changeChannel } from '../redux/ducks/actions/channel';
// normal api calls
import { getMessagesFromChannel } from '../utils/message';
import { getChannels } from '../utils/channel';
// models
import Message from '../models/Message';
import Channel from '../models/Channel';
// virtual windowing tool
import { Virtuoso, VirtuosoMethods } from 'react-virtuoso';
// Redux
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
// socket.io
import io from 'socket.io-client';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      width: '100vw',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
      zIndex: 1,
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    channelHeader: {
      height: '5vh',
      padding: theme.spacing(2),
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      position: 'relative',
    },
    content: {
      flexGrow: 1,
      height: '85vh',
    },
    messageSendWindow: {
      left: drawerWidth,
    },
    image: {
      image: `url(${state})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
    },
  })
);

const MessageCenter = (props: any) => {
  const classes = useStyles();
  const [channel, setChannel] = useState((null as unknown) as Channel);
  const [channelList, setChannelList] = useState([] as Channel[]);
  const [messageList, setMessageList] = useState([] as Message[]);

  const [messageReceived, setMessageReceived] = useState(false);
  const [socket, setSocket] = useState(
    (null as unknown) as SocketIOClient.Socket
  );
  const [invisible, setInvisible] = useState([] as boolean[]);
  const virtuoso = useRef<VirtuosoMethods>(null);
  // this will need to be changed a lot so abstract it out some
  const messageView = (
    <Virtuoso
      ref={virtuoso}
      totalCount={messageList.length}
      followOutput={true}
      item={(index) => {
        return messageRow(messageList, index);
      }}
    />
  );
  // make sure the socket is defined
  if (!socket) {
    const newSocket: SocketIOClient.Socket = io('http://localhost:4000/');
    setSocket(newSocket);
  }
  const socketCallback = (message: any) => {
    // this has the IDs instead of objects for user and channel
    if (channel && message.channel === channel._id) {
      // add the message to the list and update
      setMessageList((m) => {
        m.push(message);
        return [...m];
      });
    } else if (channel && message.channel !== channel._id) {
      //determine which channel has been updated and set its invisibility amrker
      let channelWithNotification: number = channelList.findIndex(
        (channelSearch) => {
          return message.channel === channelSearch._id;
        }
      );
      if (channelWithNotification !== -1) {
        handleBadgeVisibility(false, channelWithNotification);
        setMessageReceived(!messageReceived);
      }
    }
  };

  // helper function for setting boolean notifications
  const handleBadgeVisibility = (value: boolean, index: number) => {
    setInvisible((invisible) => {
      invisible[index] = value;
      return invisible;
    });
  };

  // get the list of channels in this organization from the backend and set the default channel to General
  useEffect(() => {
    getChannels(props.auth).then((allChannels) => {
      if (allChannels) {
        setChannelList(allChannels);
        // initialize the array with the amount of channels there are
        const invisibilityArray = Array.apply(
          null,
          Array(allChannels.length)
        ).map(() => true);
        // set it to the state variable
        setInvisible(invisibilityArray);
        // join all of the channels with our socket
        if (socket) {
          for (let i = 0; i < allChannels.length; i++) {
            socket.emit('join', allChannels[i]._id);
          }
        }
        // start off on General
        const outChannel = allChannels.find((val) => {
          if (val.name === 'General') {
            return val;
          }
          return undefined;
        });
        if (outChannel) {
          props.changeChannel(outChannel);
          setChannel(outChannel);
        }
      }
    });
  }, []);

  // set up socket event for getting messages
  useEffect(() => {
    try {
      if (socket) {
        socket.off('message');
        socket.on('message', socketCallback);
      }
    } catch (err) {
      console.log(err);
    }
  }, [messageList]);

  // rerender if we receive a message so the notification pops up
  useEffect(() => {}, [messageReceived]);
  const moveToBottom = () => {
    setTimeout(() => {
      if (virtuoso && virtuoso.current) {
        virtuoso.current.scrollToIndex({
          index: messageList.length + 1,
          align: 'end',
        });
      }
    }, 150);
  };
  // get all of the messages in the current channel
  useEffect(() => {
    if (channel) {
      getMessagesFromChannel(channel, props.auth).then((response) => {
        if (response) {
          const receivedMessagesList = response.data;
          setMessageList(receivedMessagesList);
        }
      });
    }
  }, [channel]);

  const channelDrawer = (
    <>
      <nav className={classes.drawer} aria-label='mailbox folders'>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open>
            <Typography variant='h6' align='center'>
              Channels
            </Typography>
            <Divider />
            <List>
              {channelList.map((item, index) => (
                <ListItem
                  button
                  key={item.name}
                  onClick={() => {
                    props.changeChannel(item);
                    setChannel(item);
                    handleBadgeVisibility(true, index);
                  }}>
                  <ListItemIcon>
                    <StopRoundedIcon />
                  </ListItemIcon>
                  <Badge
                    color='secondary'
                    variant='dot'
                    invisible={invisible[index]}>
                    <ListItemText primary={item.name} />
                  </Badge>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Drawer>
        </Hidden>
      </nav>
    </>
  );

  // goes to the most recent message on page load
  useEffect(moveToBottom, [messageList]);
  // Redirect if not logged in
  if (!props.isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <>
      <NavBar />
      <div className={classes.root}>
        {channelDrawer}
        <main className={classes.content}>
          {/* <div className={classes.root} /> */}
          <div className={classes.channelHeader}>
            {channel && <Typography variant='h4'>{channel.name}</Typography>}
          </div>
          <div
            style={{
              height: '78%',
            }}>
            {messageView}
          </div>
          <SendMessageArea />
        </main>
      </div>
    </>
  );
};
const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth.token,
  userInfo: state.auth.user,
});

export default connect(mapStateToProps, { changeChannel })(MessageCenter);
