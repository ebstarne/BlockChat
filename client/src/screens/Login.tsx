import React, { useState } from 'react';
import nc from '../assets/nc.png';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import RegisterUser from '../components/RegisterUser';
import NavBar from '../components/NavBar';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';

// Redux
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../redux/ducks/actions/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '90vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    position: 'absolute',
    right: '1%',
    top: '25%',
  },
  image: {
    backgroundImage: `url(${nc})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  formControl: {
    minWidth: 195,
  },
}));

const Login = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async () => {
    if ((await props.login(username, password)) === 'failure') {
      enqueueSnackbar('Login Failed', { variant: 'warning' });
    }
  };
  const classes = useStyles();

  // Redirect if logged in
  if (props.isAuthenticated) {
    return <Redirect to='/message' />;
  }

  return (
    <React.Fragment>
      <NavBar />
      <Grid container className={classes.root}>
        <Grid
          item
          className={classes.image}
          xs={false}
          sm={7}
          md={8}
          lg={9}></Grid>

        <Grid
          className={classes.paper}
          container
          item
          direction='column'
          justify='space-evenly'
          alignItems='flex-start'
          alignContent='flex-end'
          spacing={1}
          xs={12}
          sm={5}
          md={4}
          lg={3}>
          <Grid item>
            <Typography variant='h5'>{props.organization}</Typography>
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

          <Grid item>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disableElevation
              disabled={username === '' || password === ''}
              onClick={handleSubmit}>
              Log In
            </Button>
          </Grid>

          <Grid item>
            <RegisterUser />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
  organization: state.theme.org,
});

export default connect(mapStateToProps, { login })(Login);
