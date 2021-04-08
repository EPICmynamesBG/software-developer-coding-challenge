import * as React from "react";
import { Button, FormControl, Input, InputLabel, FormHelperText, Typography, Link as UILink } from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom';

/** Presentation */
import ErrorMessage from "../components/ErrorMessage";

/** Custom Hooks */
import useErrorHandler from "../utils/custom-hooks/ErrorHandler";

/** Utils */
import Header from '../root/Header';
import * as API from '../utils/API';

function CreateAccount() {
  const [accountCreated, setAccountCreated] = React.useState(false);
  const [renderLoginScreen, showLoginScreen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [confirmPassword, setConfirmUserPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { error, showError } = useErrorHandler(null);

  window.document.title = "trdrev";

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
    <form onSubmit={formSubmit} className="login">
      <Header>Create Account</Header>
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
      <FormHelperText id="password-desc">Enter a password</FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="confirm-password">
          Password
        </InputLabel>
        <Input
          id="confirm-password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={e => setConfirmUserPassword(e.target.value)}
          aria-describedby="confirm-password-desc"
        />
        <FormHelperText id="confirm-password-desc">Confirm your password</FormHelperText>
      </FormControl>
      <Button type="submit" disabled={loading || accountCreated} onClick={formSubmit}>
        {loading ? "Loading..." : "Create Account"}
      </Button>
      <Typography>
        <UILink component={Link} to="/login">Login</UILink>
      </Typography>
      {error && <ErrorMessage errorMessage={error} />}
    </form>
  );
}

export default CreateAccount;
