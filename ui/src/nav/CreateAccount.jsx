import * as React from "react";
import { Button, Typography, FormGroup, TextField } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

/** Presentation */
import ErrorMessage from "../components/ErrorMessage";

/** Custom Hooks */
import useErrorHandler from "../utils/custom-hooks/ErrorHandler";

/** Utils */
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

function CreateAccount() {
  const [accountCreated, setAccountCreated] = React.useState(false);
  const [renderLoginScreen, showLoginScreen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [confirmPassword, setConfirmUserPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { error, showError } = useErrorHandler(null);
  const classes = useStyles();

  const createAccount = async () => {
    try {
      setLoading(true);
      const account = await API.CreateAccount(userEmail, userPassword, confirmPassword);
      console.log(account);
      setAccountCreated(true);
      setTimeout(() => {
        showLoginScreen(true);
      }, 3000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      showError(err.message);
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    await createAccount();
  };

  if (renderLoginScreen) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography color="inherit" variant="h3" >
          Create Account
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
          helperText="Enter a password"
          label="Password"
          disabled={loading}
        />
        <TextField
          id="confirm-password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={e => setConfirmUserPassword(e.target.value)}
          aria-describedby="confirm-password-desc"
          helperText="Confirm your password"
          label="Confirm Password"
          disabled={loading}
        />
      </FormGroup>
        <FormGroup className={classes.container}>
          <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={loading || accountCreated} onClick={formSubmit}>
            {loading ? "Loading..." : "Create Account"}
          </Button>
        </FormGroup>
      </form>
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}

export default AppNavWrapper({ title: 'Forgot Password' })(CreateAccount);;
