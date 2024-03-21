import React from 'react';
import { Redirect } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InfoButton from './InfoButton';
import state from '../assets/state.png';

import { connect } from 'react-redux';
import { logout } from '../redux/ducks/actions/auth';

const NavBar = (props: any) => {
  const logoutUser = () => {
    // logs out logically
    props.logout();
    // brings you back to the home screen
    // Message Center already has this logic but if you want to add other screens you can log out
    // this'll be needed
    return <Redirect to='/' />;
  };

  return (
    <>
      <AppBar position='relative' style={{ boxShadow: 'none' }}>
        <Toolbar>
          <Grid
            container
            direction='row'
            justify='space-between'
            alignItems='center'>
            <Grid item>
              <img
                src={state}
                alt='State'
                width='143'
                height='64'
                style={{ alignContent: 'left' }}
              />
            </Grid>
            <Grid item>
              <div>
                <InfoButton />
                {props.auth && (
                  <Button
                    onClick={logoutUser}
                    variant='contained'
                    style={{ zIndex: 10000 }}>
                    Logout
                  </Button>
                )}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  auth: state.auth.token,
});

export default connect(mapStateToProps, { logout })(NavBar);
