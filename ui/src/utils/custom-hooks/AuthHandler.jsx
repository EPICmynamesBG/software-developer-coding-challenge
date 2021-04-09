import * as React from "react";
import * as API from '../API';


const useAuthHandler = (initialState) => {
  const [auth, setAuth] = React.useState(initialState);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastRefreshed, setLastRefreshed] = React.useState(null);
  const timeout = React.useRef();

  let setAuthStatus;
  const setUnauthStatus = () => {
    window.localStorage.clear();
    setAuth(null);
  };

  const refresh = async () => {
    console.log('refreshing');
    try {
      const { token } = await API.Refresh({ auth: auth });
      setAuthStatus({
        ...auth,
        token
      });
    } catch (e) {
      console.error(e);
      setUnauthStatus();
    }
  };

  const setAutoRefresh = (inMinutes = 5) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    timeout.current = setTimeout(() => {
      refresh();
    }, inMinutes * 60 * 1000);
  }

  setAuthStatus = (userAuth) => {
    window.localStorage.setItem("UserAuth", JSON.stringify(userAuth));
    setAuth(userAuth);
  };

  React.useEffect(() => {
    if (auth) {
      setAutoRefresh();
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    }
  }, [auth]);

  return {
    auth,
    forceRefresh: () => setAutoRefresh(0),
    setAuthStatus,
    setUnauthStatus
  };
};

export default useAuthHandler;
