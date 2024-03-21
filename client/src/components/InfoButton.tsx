import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useLocation } from 'react-router-dom';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';

const InfoButton = (props: any) => {
  const [openInfo, setOpenInfo] = React.useState(false);
  let infoTitle = '';
  let infoText = '';

  const handleInfoOpen = () => {
    setOpenInfo(true);
  };

  const handleInfoClose = () => {
    setOpenInfo(false);
  };
  const route = useLocation().pathname;
  switch (route) {
    case '/':
      infoTitle = 'Welcome!';
      infoText =
        'This is BlockChat! This is a chatting application built to show off how the blockchain works and how it can be used in business operations. While a chatting application may not be the best real world application of the blockchain, it can be used to show off some functionality of it.\n Created by NCSU CSC Senior Design Team 1, Fall 2020:\nDominick Bagnoli, Seth Hollandsworth, Thomas Landsberg, and Eric Starner.';
      break;
    case '/login':
      infoTitle = 'Login';
      infoText =
        'This is the login screen showing you have entered your organization. Notice the entire website theme changed! Here you will need to log in. If you do not have an account for this organization, you can choose to make one with a unique username and password. After you create an account you will be automatically logged in and taken to the Message Center.';
      break;
    case '/message':
      infoTitle = 'Message Center';
      infoText =
        'This is the Message Center, the meat of this application. There is a lot to explain here in terms of the blockchain. The left panel shows the channels your organization belongs to. Organizations can have channels between one or more other organizations on the same blockchain!\nWhen you send a message, the message goes to each organization’s local database first, then is distributed to the blockchain where the transaction is verified by all other organizations in the channel. This means people in your organization will receive your message before others in a different organizations.\nAfter your message appears in your message history, you can click it to see where your message has been and when it took these steps.\nOne of the biggest pieces of information here is that organizations will each have their own database with message history, but the blockchain will hold the “master list” of transactions. Transactions can never be edited or deleted from the blockchain. Another thing to note is that even though organizations will have their own databases, they will still be able to share information and transactions across their separate databases.';
      break;
  }

  return (
    <>
      <IconButton
        aria-label='additional info for screen'
        aria-haspopup='true'
        onClick={handleInfoOpen}
        color='inherit'>
        <InfoIcon />
      </IconButton>
      <Dialog
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={openInfo}
        onClose={handleInfoClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}>
        <DialogTitle>{infoTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: 'black' }}>
            {infoText.split('\n').map((str, index) => (
              <p key={index}>{str}</p>
            ))}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default InfoButton;
