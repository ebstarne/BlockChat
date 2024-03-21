import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Login from '../screens/Login';
import Welcome from '../screens/Welcome';
import MessageCenter from '../screens/MessageCenter';
import InfoButton from '../components/InfoButton';
import messageRow from '../components/messageRow';
import NavBar from '../components/NavBar';
import RegisterUser from '../components/RegisterUser';
import SendMessageArea from '../components/SendMessageArea';

describe('Login', () => {
  let store;
  let component;

  const mockStore = configureStore([]);

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: 'true',
      },
      theme: {
        org: 'Galactic Empire',
        theme: {
          common: {
            black: '#000',
            white: '#fff',
          },
          background: {
            paper: '#fff',
            default: '#fafafa',
          },
          primary: {
            light: 'rgba(94, 194, 250, 1)',
            main: 'rgba(14, 146, 199, 1)',
            dark: 'rgba(0, 100, 150, 1)',
            contrastText: 'rgba(0, 0, 0, 1)',
          },
          secondary: {
            light: 'rgba(255, 255, 255, 1)',
            main: 'rgba(255, 255, 255, 1)',
            dark: 'rgba(255, 255, 255, 1)',
            contrastText: 'rgba(255, 255, 255, 1)',
          },
          error: {
            light: '#e57373',
            main: '#f44336',
            dark: '#d32f2f',
            contrastText: 'rgba(255, 255, 255, 1)',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)',
          },
        },
      },
    });
  });

  it('Test the login page is loaded', () => {
    component = renderer.create(
      <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </SnackbarProvider>
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  //   it("Test the actual page is loaded", () => {
  //     component = renderer.create(
  //       <Provider store={store}>
  //         <SnackbarProvider maxSnack={3}>
  //           <BrowserRouter>
  //             <MessageCenter />
  //           </BrowserRouter>
  //         </SnackbarProvider>
  //       </Provider>
  //     );
  //     expect(component.toJSON()).toMatchSnapshot();
  //   });

  it('Test the welcome page is loaded', () => {
    component = renderer.create(
      <Provider store={store}>
        <BrowserRouter>
          <Welcome />
        </BrowserRouter>
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
