import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';
import './App.css';
import Login from './screens/Login';
import Welcome from './screens/Welcome';
import MessageCenter from './screens/MessageCenter';
import ThemeProvider from './themes/ThemeProvider';

// Redux
import { Provider } from 'react-redux';
import { persistor, store } from './redux/ducks/store';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider>
          <PersistGate persistor={persistor}>
            <Router>
              <Fragment>
                <section className='container'>
                  <Switch>
                    <Route exact path='/' component={Welcome} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/message' component={MessageCenter} />
                  </Switch>
                </section>
              </Fragment>
            </Router>
          </PersistGate>
        </ThemeProvider>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
