import * as React from "react";
import {
  Route,
  Redirect
} from 'react-router-dom'

/** Context */
import { authContext } from "../contexts/AuthContext";

function AuthenticatedRoute({ children, ...etc }) {
  const { auth } = React.useContext(authContext);

  const render = ({ location }) => {
    if (!auth || !auth.token) {
      return <Redirect to={{
        pathname: '/login',
        state: { from: location }
      }} />;
    }
    return children;
  };

  return (
    <Route
      {...etc}
      render={render}
    />
  );
}

export default AuthenticatedRoute;
