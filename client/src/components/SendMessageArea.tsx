import React, { useEffect, useState, KeyboardEvent } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
// normal api calls
import { sendMessage } from '../utils/message';
// models
import Message from '../models/Message';
import User from '../models/User';
// Redux
import { connect } from 'react-redux';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageSendWindow: {
      left: drawerWidth,
    },
    messageArea: {
      width: '100%',
      height: '15vh',
    },
  })
);
const SendMessageArea: React.FC = (props: any) => {
  const classes = useStyles();
  const [messageValue, setMessageValue] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  // get the data from the current user in the store
  const currentUser: User = props.userInfo;
  // cleanup the text box after a message has been sent
  // was having an issue with the "enter" to send a message staying in the box after the message was sent
  // this is for that scenario
  useEffect(() => {
    setMessageValue('');
  }, [messageSent]);

  // function to add a new message to the channel
  const submitMessage = () => {
    // don't submit the message if the contents are empty
    if (!messageValue || !messageValue.trim()) {
      return;
    }

    const newMessage: Message = {
      user: currentUser,
      username: currentUser.username,
      text: messageValue,
      date: new Date(),
      channel: props.currentChannel.channel,
      organization: currentUser.organization.name,
    };

    // send message to the database
    const response = sendMessage(newMessage, props.auth);

    // say that we have sent a message so the text box can be cleaned up
    setMessageSent(!messageSent);
  };

  // function to determine if enter is being pressed in the message box
  const enterPress = (event: KeyboardEvent) => {
    return event.key === 'Enter' && !event.shiftKey;
  };

  return (
    <>
      <Drawer
        anchor={'bottom'}
        classes={{
          paper: classes.messageSendWindow,
        }}
        variant='permanent'
        open>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitMessage();
          }}>
          <Grid container direction='row' className={classes.messageArea}>
            <Grid item xs={11}>
              <TextField
                id='standard-full-width'
                style={{ margin: 8, verticalAlign: 'bottom' }}
                placeholder='Message the Channel'
                fullWidth
                multiline
                rowsMax={4}
                rows={1}
                margin='normal'
                value={messageValue}
                onKeyPress={(e) => {
                  if (enterPress(e)) {
                    submitMessage();
                  }
                }}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button type='submit'>
                <SendRoundedIcon />
              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>
    </>
  );
};
const mapStateToProps = (state: any) => ({
  currentChannel: state.channel,
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth.token,
  userInfo: state.auth.user,
});

export default connect(mapStateToProps)(SendMessageArea);
