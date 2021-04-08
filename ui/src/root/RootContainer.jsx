import * as React from "react";
import {
  Redirect,
  BrowserRouter as Router
} from 'react-router-dom'

/** Context */
import { authContext } from "../contexts/AuthContext";

// import Login from '../nav/Login';
import Header from './Header';
import Footer from './Footer';

function RootContainer({ location }) {
  console.log(location);
  const { auth } = React.useContext(authContext);
  if (!auth || !auth.id) {
    return <Redirect to={{
      pathname: '/login',
      state: { from: location }
    }} />;
  }

  return (
    <React.Fragment>
      <Header />
      <main>
        <h1>Hello World</h1>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default RootContainer;
