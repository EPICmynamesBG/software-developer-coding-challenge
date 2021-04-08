import './App.css';
import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Login from './nav/Login';
import CreateAccount from './nav/CreateAccount';
import ForgotPassword from './nav/ForgotPassword';
import AuthContextProvider from './contexts/AuthContext';
import AuthenticatedRoute from './hoc/AuthenticatedRoute';
import Logout from './nav/authenticated/Logout';
import Dashboard from './nav/authenticated/primary/Dashboard';
import MarketListings from './nav/authenticated/primary/MarketListings';
import MyListings from './nav/authenticated/primary/MyListings';


function App() {
  return (
    <AuthContextProvider>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/newaccount">
            <CreateAccount />
          </Route>
          <Route path="/forgotpassword">
            <ForgotPassword />
          </Route>
          <AuthenticatedRoute path="/logout">
            <Logout />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/market">
            <MarketListings />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/my-listings">
            <MyListings />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/">
            <Dashboard />
          </AuthenticatedRoute>
          <Route path="*">
            <div>404 - Page Not Found</div>
          </Route>
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
