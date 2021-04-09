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
import ListingDetails from './nav/authenticated/primary/ListingDetails';
import EditListingDetails from './nav/authenticated/primary/listingDetails/EditListingDetails';
import CreateListing from './nav/authenticated/primary/listingDetails/CreateListing';

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
          <Route exact path="/market">
            <MarketListings />
          </Route>
          <Route exact path="/market/:listingId">
            <ListingDetails />
          </Route>
          <AuthenticatedRoute exact path="/my-listings">
            <MyListings />
          </AuthenticatedRoute>
          <AuthenticatedRoute exact path="/my-listings/create">
            <CreateListing />
          </AuthenticatedRoute>
          <AuthenticatedRoute exact path="/my-listings/:listingId">
            <ListingDetails />
          </AuthenticatedRoute>
          <AuthenticatedRoute exact path="/my-listings/:listingId/edit">
            <EditListingDetails />
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
