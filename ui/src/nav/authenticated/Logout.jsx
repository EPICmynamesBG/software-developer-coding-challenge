import * as React from "react";
import {
  Redirect
} from 'react-router-dom'

/** Custom Hooks */
import useErrorHandler from "../../utils/custom-hooks/ErrorHandler";

/** Context */
import { authContext } from "../../contexts/AuthContext";

/** Utils */
import * as API from '../../utils/API';

function Logout() {
  const [loggingOut, setLoggingOut] = React.useState(false);
  const auth = React.useContext(authContext);
  const { showError } = useErrorHandler(null);

  const performLogout = async () => {
    console.log("LOGOUT");
    try {
      setLoggingOut(true);
      await API.Logout(auth.auth.token);
      auth.setUnauthStatus();
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
      showError(err.message);
    }
  };

  if (!auth.auth) {
    return <Redirect to="/login" />;
  }

  if (!loggingOut) {
    performLogout();
  }

  return (
    <div>
      Logging out...
    </div>
  );
}

export default Logout;
