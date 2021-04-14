import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { useHistory } from "react-router-dom";
import AppNavWrapper from '../../../../hoc/AppNavWrapper';

import { authContext } from './../../../../contexts/AuthContext';
import * as API from '../../../../utils/API';
import { timestampToDatetimeLocalInputString, localeDatetimeToISOString } from '../../../../utils/Helpers';

/** Presentation */
import ErrorMessage from "../../../../components/ErrorMessage";
import NhtsaPreview from "../../../../components/NhtsaPreview";

/** Custom Hooks */
import useErrorHandler from "../../../../utils/custom-hooks/ErrorHandler";

import { Button, CircularProgress, FormGroup, FormLabel, TextareaAutosize } from '@material-ui/core';
import FormStateCacheHOC from '../../../../hoc/FormStateCacheHOC';
import FileUploadArea from '../../../../components/FileUploadArea';

const { useEffect, useState, useContext } = React;

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

function CreateListing({ formCache = {}}) {
  const classes = useStyles();
  const [formState, setFormState] = useState(formCache.state);
  const [isLoading, setIsLoading] = useState(false);
  const [nhtsaData, setNhtsaData] = useState();
  const [isLookingUpVin, setIsLookingUpVin] = useState(false);
  const { error, showError } = useErrorHandler(null);
  const history = useHistory();
  const auth = useContext(authContext);

  const { vehicleVin } = formState;

  useEffect(() => {
    if (isLookingUpVin) {
      return;
    }
    if (get(formState, 'vehicleVin', '').length !== 17) {
      return;
    }
    setIsLookingUpVin(true);
    API.LookupVIN(formState.vehicleVin)
      .then((data) => {
        setNhtsaData(data.results);
      })
      .catch(console.error)
      .finally(() => {
        setIsLookingUpVin(false);
      });
  }, [vehicleVin]);

  if (!auth.auth) {
    history.push('/logout');
  }

  const uploadPhotos = async (photos = [], listingId) => {
    for (const file of photos) {
      try {
        await API.UploadListingFile(auth, listingId, file);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const submit = async (data = {}) => {
    const photos = data.photos;
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
    delete modifiedSubmission.photos;
    try {
      setIsLoading(true);
      const { accountlisting: listing } = await API.CreateListing(auth, modifiedSubmission);
      await uploadPhotos(photos, listing.id);
      formCache.clearState();
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
    formCache.saveState(newState);
    setFormState(newState);
  };


  const onVinBlur = (e) => {
    API.LookupVIN(formState.vehicleVin)
      .then((data) => {
        setNhtsaData(data.results);
      })
      .catch(console.error);
  };

  return (
    <div>
      {error && <ErrorMessage errorMessage={error} />}
      {isLoading && <CircularProgress />}
      <form name="create-listing" className={classes.root} noValidate autoComplete="off" onSubmit={handleFormSubmit}>
        <FormGroup className={classes.container}>
          <TextField id="vehicleVin" label="VIN" variant="outlined" inputProps={{
            pattern: '/.*{17}/'
          }} required aria-required onChange={updateFormFieldValue} onBlur={onVinBlur} disabled={isLoading} defaultValue={formState.vehicleVin} />
          {nhtsaData && <NhtsaPreview {...nhtsaData} />}
          {isLookingUpVin && <CircularProgress />}
        </FormGroup>
        <FormGroup className={classes.container}>
          <FormLabel>Display Fields</FormLabel>
          <TextField id="title" label="Title" aria-label="title" required aria-required onChange={updateFormFieldValue} disabled={isLoading} defaultValue={formState.title} />
          <TextareaAutosize id="description" aria-label="empty textarea" placeholder="Description" rowsMin={3} required aria-required onChange={updateFormFieldValue} disabled={isLoading} defaultValue={formState.description} />
          <FileUploadArea
            inputProps={{
              id: 'photos'
            }}
            onChange={updateFormFieldValue}
          />
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
              shrink: true,
              min: formState.startAtTimestamp
            }}
            required
            aria-required
            onChange={updateFormFieldValue}
            defaultValue={formState.endAtTimestamp}
          />
        </FormGroup>
        <FormGroup className={classes.container}>
          <Button disabled={isLoading} className={classes.button} type="submit" variant="contained" color="primary">
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </FormGroup>
      </form>
    </div>
  );
}

CreateListing.propTypes = {
  formCache: PropTypes.shape({
    state: PropTypes.object.isRequired,
    clearState: PropTypes.func.isRequired,
    saveState: PropTypes.func.isRequired
  }).isRequired
};

export default (
  AppNavWrapper({ title: 'Create Listing' })(
    FormStateCacheHOC(CreateListing, { formName: 'createListing' })
  )
);
