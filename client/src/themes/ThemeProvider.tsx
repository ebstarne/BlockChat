import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { DefaultTheme } from './Defaulttheme';
import { connect } from 'react-redux';

const ThemeProvider: React.FC = (props: any) => {
  // get the palette
  let theme;
  // if we don't have an organization, go default
  if (!props.organization) {
    theme = DefaultTheme;
  } else {
    theme = createMuiTheme({ palette: props.palette });
  }
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
};
const mapStateToProps = (state: any) => ({
  organization: state.theme.org,
  palette: state.theme.theme,
});

export default connect(mapStateToProps)(ThemeProvider);
