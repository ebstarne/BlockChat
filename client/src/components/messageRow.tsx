import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Message from '../models/Message';
/**
 * helper function to render the message inside the scrollable window
 * @param props
 */
const messageRow = (data: Message[], index: number) => {
  const messageToRender = data[index];
  const event = {
    message: 'testing this message for adding to blockchain',
    time: new Date(),
  };
  const events = [event, event, event, event];
  return (
    <PopupState variant='popper' popupId='popup-popper'>
      {(popupState) => (
        <div>
          <ListItem button key={index} {...bindToggle(popupState)}>
            <ListItemAvatar>
              <Avatar
                alt={'test'}
                src={require(`../assets/avatars/${messageToRender.organization.replace(
                  /\s/g,
                  ''
                )}Avatar.png`)}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${messageToRender.username}: ${messageToRender.text}`}
              primaryTypographyProps={{
                style: { wordWrap: 'break-word' },
              }}
              secondary={`${new Date(messageToRender.date).toLocaleString()}`}
            />
          </ListItem>

          <Popper
            {...bindPopper(popupState)}
            transition
            style={{ zIndex: 10000 }}>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper style={{ borderSpacing: 3 }}>
                  <List>
                    {events.map((event, index) => {
                      return (
                        <>
                          <ListItem key={index}>
                            <ListItemText
                              primary={`${event.message}`}
                              secondary={`${event.time}`}
                            />
                          </ListItem>
                          {index + 1 !== events.length && <hr />}
                        </>
                      );
                    })}
                  </List>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  );
};

export default messageRow;
