import * as React from "react";
import { Button, Typography, Link as UILink, FormGroup, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {
  Link,
  Redirect,
  useLocation
} from 'react-router-dom'

/** Presentation */
import ErrorMessage from "../components/ErrorMessage";

/** Custom Hooks */
import useErrorHandler from "../utils/custom-hooks/ErrorHandler";

/** Context */
import { authContext } from "../contexts/AuthContext";

/** Utils */
import { validateLoginForm } from "../utils/Helpers";
import * as API from '../utils/API';
import AppNavWrapper from "../hoc/AppNavWrapper";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 15,
    '& > *': {
      margin: theme.spacing(2),
      width: '50ch'
    }
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 15,
    '& > *': {
      margin: theme.spacing(2),
      width: '50ch'
    }
  },
  button: {
    margin: theme.spacing(2),
  },
  link: {
    margin: 20
  }
}));

function Login() {
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const auth = React.useContext(authContext);
  const { error, showError } = useErrorHandler(null);
  const classes = useStyles();
  const location = useLocation();

  let forwardTo = '/';
  if (location.state && location.state.from) {
    forwardTo = location.state.from;
  }

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
    return <Redirect to={forwardTo} />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography color="inherit" variant="h3" >
          Sign In
        </Typography>
      </div>
      <form onSubmit={formSubmit} className="login">
        <FormGroup className={classes.container}>
          <TextField
            id="email"
            type="email"
            name="email"
            value={userEmail}
            placeholder="john@mail.com"
            onChange={e => setUserEmail(e.target.value)}
            aria-describedby="email-desc"
            helperText="Login using your email"
            label="Email Address"
            disabled={loading}
          />
          <TextField
            id="password"
            type="password"
            name="password"
            value={userPassword}
            placeholder="Password"
            onChange={e => setUserPassword(e.target.value)}
            aria-describedby="password-desc"
            helperText="Enter password to finish the login form"
            label="Password"
            disabled={loading}
          />
        </FormGroup>
        <FormGroup className={classes.container}>
          <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={loading} onClick={formSubmit}>
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </FormGroup>
      </form>
      <Typography className={classes.container}>
        <UILink className={classes.link} component={Link} to="/newaccount">Create Account</UILink>
        <UILink className={classes.link} component={Link} to="/forgotpassword">Forgot Password</UILink>
      </Typography>
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}

export default AppNavWrapper({ title: 'Login' })(Login);
