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
  const [renderLoginScreen, showLoginScreen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { error, showError } = useErrorHandler(null);

  window.document.title = "trdrev";

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
    <form onSubmit={formSubmit} className="login">
      <Header>Forgot Password</Header>
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
      <Button type="submit" disabled={loading || submitted} onClick={formSubmit}>
        {loading ? "Loading..." : "Submit"}
      </Button>
      <Typography>
        <UILink component={Link} to="/login">Login</UILink>
      </Typography>
      {error && <ErrorMessage errorMessage={error} />}
    </form>
  );
}

export default CreateAccount;
