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

function ForgotPassword() {
  const [renderLoginScreen, showLoginScreen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { error, showError } = useErrorHandler(null);
  const classes = useStyles();

  const submit = async () => {
    try {
      setLoading(true);
      const account = await API.ForgotPassword(userEmail);
      console.log(account);
      setSubmitted(true);
      setTimeout(() => {
        showLoginScreen(true);
      }, 3000);
    } catch (err) {
      setLoading(false);
      showError(err.message);
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    await submit();
  };

  if (renderLoginScreen) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography color="inherit" variant="h3" >
          Forgot Password
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
            helperText="Provide your login email"
            label="Email Address"
            disabled={loading}
          />
        </FormGroup>
        <FormGroup className={classes.container}>
          <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={loading || submitted} onClick={formSubmit}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </FormGroup>
      </form>
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}

export default AppNavWrapper({ title: 'Forgot Password' })(ForgotPassword);
