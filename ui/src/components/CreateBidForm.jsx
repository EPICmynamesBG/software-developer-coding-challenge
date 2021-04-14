import * as React from 'react';
import { Button, TextField, FormGroup, makeStyles } from '@material-ui/core';
import FormStateCacheHOC from '../hoc/FormStateCacheHOC';
import { authContext } from '../contexts/AuthContext';
import * as API from '../utils/API';
import ErrorMessage from './ErrorMessage';
import useErrorHandler from '../utils/custom-hooks/ErrorHandler';
import { useHistory } from 'react-router';
const { useState, useContext } = React;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 15,
    borderTop: '1px solid black'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 15,
    '& > *': {
      margin: theme.spacing(2),
      width: '25ch'
    }
  },
  button: {
    margin: 'auto'
  }
}));

function CreateBidForm(props) {
  const {
    formCache = {},
    listingId,
    onBidCreate = () => {},
    currentMaxBid = 0
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    currency: 'USD',
    ...formCache.state
  });
  const { error, showError } = useErrorHandler();
  const auth = useContext(authContext);
  const classes = useStyles();
  const history = useHistory();


  const submit = async (data = {}) => {
    if (!auth.auth) {
      history.push('/login', {
        from: history.location.pathname
      });
      return;
    }

    try {
      setIsLoading(true);
      const output = await API.CreateBid(auth, listingId, data);
      formCache.clearState();
      const bid = {
        ...output.listingbid,
        account: auth.auth
      };
      onBidCreate(bid);
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submit(formState);
  };

  const updateFormFieldValue = (e) => {
    const newState = {
      ...formState,
      [e.target.id]: e.target.value
    };
    formCache.saveState(newState);
    setFormState(newState);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleFormSubmit}>
        <FormGroup className={classes.container}>
          <TextField id="bidValue" label="Bid" variant="outlined" inputProps={{
            type: 'number',
            min: currentMaxBid,
            step: '0.01'
          }} required aria-required onChange={updateFormFieldValue} disabled={isLoading} defaultValue={formState.bidValue} />
          <TextField id="currency" label="Currency" variant="outlined" value="USD" disabled onChange={updateFormFieldValue} defaultValue={formState.currency} />
        </FormGroup>
        <FormGroup className={classes.container}>
          <Button variant="outlined" color="primary" type="submit" disabled={isLoading}>Bid</Button>
        </FormGroup>
        {error && <ErrorMessage message={error.message} />}
      </form>
    </div>
  );
}

export default FormStateCacheHOC(CreateBidForm, { formName: 'CreateBid' })