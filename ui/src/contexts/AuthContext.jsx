import * as React from "react";
import PropTypes from 'prop-types';

/** Custom Hooks */
import useAuthHandler from "../utils/custom-hooks/AuthHandler";
/** Utils */
import { getStoredUserAuth } from "../utils/Helpers";

export const authContext = React.createContext({
  auth: null,
  setAuthStatus: () => {},
  setUnauthStatus: () => {}
});

const { Provider } = authContext;
const AuthProvider = ({ children }) => {
  const { auth, setAuthStatus, setUnauthStatus } = useAuthHandler(
    getStoredUserAuth()
  );

  return (
    <Provider value={{ auth, setAuthStatus, setUnauthStatus }}>
      {children}
    </Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default AuthProvider;
