import * as React from "react";
import * as API from '../API';


const useAuthHandler = (initialState) => {
  const [auth, setAuth] = React.useState(initialState);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastRefreshed, setLastRefreshed] = React.useState(null);
  const timeout = React.useRef();

  let setAuthStatus;
  const refresh = async () => {
    const { token } = await API.Refresh(auth);
    setAuthStatus({
      ...auth,
      token
    });
  };

  const setAutoRefresh = (inMinutes = 5) => {
    timeout.current = setTimeout(() => {
      refresh();
    }, inMinutes * 60 * 1000);
  }

  setAuthStatus = (userAuth) => {
    window.localStorage.setItem("UserAuth", JSON.stringify(userAuth));
    setAuth(userAuth);
    setAutoRefresh(1);
  };

  const setUnauthStatus = () => {
    window.localStorage.clear();
    setAuth(null);
  };

  return {
    auth,
    forceRefresh: () => setAutoRefresh(0),
    setAuthStatus,
    setUnauthStatus
  };
};

export default useAuthHandler;
