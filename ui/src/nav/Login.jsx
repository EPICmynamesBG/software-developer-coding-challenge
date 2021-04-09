import * as React from "react";
import { Button, FormControl, Input, InputLabel, FormHelperText, Typography, Link as UILink } from '@material-ui/core';
import {
  Link,
  Redirect
} from 'react-router-dom'

/** Presentation */
import ErrorMessage from "../components/ErrorMessage";

/** Custom Hooks */
import useErrorHandler from "../utils/custom-hooks/ErrorHandler";

/** Context */
import { authContext } from "../contexts/AuthContext";

/** Utils */
import { validateLoginForm } from "../utils/Helpers";
import Header from '../root/Header';
import * as API from '../utils/API';

function Login() {
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const auth = React.useContext(authContext);
  const { error, showError } = useErrorHandler(null);

  window.document.title = "trdrev";

  const authHandler = async () => {
    try {
      setLoading(true);
      const tokenData = await API.Login(userEmail, userPassword);
      const userInfo = await API.Me({
        ...auth,
        auth: tokenData
      });
      auth.setAuthStatus({ ...tokenData, ...userInfo });
    } catch (err) {
      console.error(err);
      setLoading(false);
      showError(err.message);
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    if (validateLoginForm(userEmail, userPassword, showError)) {
      await authHandler();
    }
  };

  if (auth.auth) {
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={formSubmit} className="login">
      <Header>Sign in</Header>
      <FormControl>
        <InputLabel htmlFor="email">
          Email Address
        </InputLabel>
        <Input
          id="email"
          type="email"
          name="email"
          value={userEmail}
          placeholder="john@mail.com"
          onChange={e => setUserEmail(e.target.value)}
          aria-describedby="email-desc"
        />
        <FormHelperText id="email-desc">Login using your email</FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="password">
          Password
        </InputLabel>
        <Input
          id="password"
          type="password"
          name="password"
          value={userPassword}
          placeholder="Password"
          onChange={e => setUserPassword(e.target.value)}
          aria-describedby="password-desc"
        />
        <FormHelperText id="password-desc">Enter password to finish the login form</FormHelperText>
      </FormControl>
      <Button type="submit" disabled={loading} onClick={formSubmit}>
        {loading ? "Loading..." : "Sign In"}
      </Button>
      <Typography>
        <UILink component={Link} to="/newaccount">Create Account</UILink>
        <UILink component={Link} to="/forgotpassword">Forgot Password</UILink>
      </Typography>
      {error && <ErrorMessage errorMessage={error} />}
    </form>
  );
}

export default Login;
