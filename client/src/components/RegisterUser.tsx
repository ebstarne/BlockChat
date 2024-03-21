import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';

// Redux
import { connect } from 'react-redux';
import { register } from '../redux/ducks/actions/auth';

const RegisterUser = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (
      (await props.register({
        username,
        email,
        password,
        organization: props.organization,
      })) === 'failure'
    ) {
      enqueueSnackbar('Register Failed', { variant: 'warning' });
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant='contained'
        color='primary'
        disableElevation
        onClick={handleClickOpen}>
        Create New Account
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth='xs'
        aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Sign Up</DialogTitle>
        <DialogContent>
          <DialogContentText>It's that easy</DialogContentText>
          <form onSubmit={handleSubmit} autoComplete='off'>
            <Grid
              container
              direction='column'
              justify='space-evenly'
              alignItems='center'
              spacing={1}>
              <Grid item>
                <TextField
                  variant='filled'
                  type='text'
                  name='email'
                  label='Email'
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant='filled'
                  type='username'
                  name='username'
                  label='Username'
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  value={username}
                />
              </Grid>

              <Grid item>
                <TextField
                  variant='filled'
                  type='password'
                  name='password'
                  label='Password'
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
              <Button
                onClick={handleClose}
                color='primary'
                type='submit'
                disabled={username === '' || password === ''}>
                Sign Up
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
  organization: state.theme.org,
});

export default connect(mapStateToProps, { register })(RegisterUser);
