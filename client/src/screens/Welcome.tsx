import React, { useEffect } from 'react';
import nc from '../assets/nc.png';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import NavBar from '../components/NavBar';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
// Redux
import { getTheme } from '../utils/theme';
import { chooseTheme, resetTheme } from '../redux/ducks/actions/theme';
import { connect } from 'react-redux';

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

const Welcome = (props: any) => {
  const classes = useStyles();
  // reset the theme on load
  useEffect(() => {
    props.resetTheme();
  }, []);
  // get the new theme that we want
  const assignTheme = () => {
    getTheme().then((result) => {
      props.chooseTheme(result);
    });
  };

  return (
    <>
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
            <Typography variant='h4'>Welcome</Typography>
          </Grid>
          <Grid item>
            <Link to='/login'>
              <Button
                onClick={assignTheme}
                variant='contained'
                color='primary'
                disableElevation>
                Enter
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default connect(null, { chooseTheme, resetTheme })(Welcome);
