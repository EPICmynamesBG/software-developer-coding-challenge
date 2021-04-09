import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { useParams, useHistory } from "react-router-dom";
import AppNavWrapper from '../../../../hoc/AppNavWrapper';

import { authContext } from './../../../../contexts/AuthContext';
import * as API from '../../../../utils/API';
import { timestampToDatetimeLocalInputString, localeDatetimeToISOString } from '../../../../utils/Helpers';

/** Presentation */
import ErrorMessage from "../../../../components/ErrorMessage";

/** Custom Hooks */
import useErrorHandler from "../../../../utils/custom-hooks/ErrorHandler";

import { Button, CircularProgress, FormGroup, FormLabel, TextareaAutosize } from '@material-ui/core';

// const localStorage = window.localStorage;

const { useEffect, useState, useContext, Fragment } = React;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
  dateField: {
    width: 250
  },
  button: {
    margin: theme.spacing(2),
  }
}));

function CreateListing() {
  const restoreFormState = localStorage.getItem('createListingForm_State') || '{}';
  const classes = useStyles();
  const [formState, setFormState] = useState(JSON.parse(restoreFormState));
  const [isLoading, setIsLoading] = useState(false);
  const { error, showError } = useErrorHandler(null);
  const history = useHistory();
  const auth = useContext(authContext);

  if (!auth.auth) {
    history.push('/logout');
  }

  const submit = async (data = {}) => {
    console.log(data);
    const modifiedSubmission = {
      ...data,
      display: {
        title: data.title,
        description: data.description
      },
      startAtTimestamp: data.startAtTimestamp ? localeDatetimeToISOString(data.startAtTimestamp) : undefined,
      endAtTimestamp: data.endAtTimestamp ? localeDatetimeToISOString(data.endAtTimestamp) : undefined
    };
    delete modifiedSubmission.title;
    delete modifiedSubmission.description;
    try {
      setIsLoading(true);
      const { accountlisting: listing } = await API.CreateListing(auth, modifiedSubmission);
      localStorage.setItem('createListingForm_State', '{}');
      history.push(`/my-listings/${listing.id}`);
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
    localStorage.setItem('createListingForm_State', JSON.stringify(newState));
    setFormState(newState);
  };

  return (
    <div>
      {error && <ErrorMessage errorMessage={error} />}
      {isLoading && <CircularProgress />}
      <form name="create-listing" className={classes.root} noValidate autoComplete="off" onSubmit={handleFormSubmit}>
        <FormGroup className={classes.container}>
          <TextField id="vehicleVin" label="VIN" variant="outlined" required aria-required onChange={updateFormFieldValue} disabled={isLoading} defaultValue={formState.vehicleVin} />
          <div>
            Placeholder NHTSA preview
          </div>
        </FormGroup>
        <FormGroup className={classes.container}>
          <FormLabel>Display Fields</FormLabel>
          <TextField id="title" label="Title" aria-label="title" required aria-required onChange={updateFormFieldValue} disabled={isLoading} defaultValue={formState.title} />
          <TextareaAutosize id="description" aria-label="empty textarea" placeholder="Description" rowsMin={3} required aria-required onChange={updateFormFieldValue} disabled={isLoading} defaultValue={formState.description} />
          <div>
            Placeholder Image uploading
          </div>
        </FormGroup>
        <FormGroup className={classes.container}>
          <FormLabel>Timing</FormLabel>
          <TextField
            disabled={isLoading}
            id="startAtTimestamp"
            label="Start Listing At"
            type="datetime-local"
            className={classes.dateField}
            InputLabelProps={{
              shrink: true
            }}
            placeholder="Default: now"
            onChange={updateFormFieldValue}
            defaultValue={formState.startAtTimestamp || timestampToDatetimeLocalInputString(Date.now())}
          />
          <TextField
            disabled={isLoading}
            id="endAtTimestamp"
            label="End Listing At"
            type="datetime-local"
            className={classes.dateField}
            InputLabelProps={{
              shrink: true
            }}
            required
            aria-required
            onChange={updateFormFieldValue}
            defaultValue={formState.endAtTimestamp}
          />
          <Button disabled={isLoading} className={classes.button} type="submit" variant="contained" color="primary">
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </FormGroup>
      </form>
    </div>
  );
}

export default (
  AppNavWrapper({ title: 'Create Listing' })(CreateListing)
);