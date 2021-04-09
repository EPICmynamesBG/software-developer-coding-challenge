import * as React from 'react';

import { useParams, useHistory } from "react-router-dom";
import AppNavWrapper from '../../../../hoc/AppNavWrapper';

import { authContext } from './../../../../contexts/AuthContext';
import * as API from '../../../../utils/API';


/** Presentation */
import ErrorMessage from "../../../../components/ErrorMessage";

/** Custom Hooks */
import useErrorHandler from "../../../../utils/custom-hooks/ErrorHandler";

import { CircularProgress } from '@material-ui/core';

const { useEffect, useState, useContext, Fragment } = React;

function EditListingDetails() {
  const [listing, setListing] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { error, showError } = useErrorHandler(null);
  const { listingId } = useParams();
  const history = useHistory();
  const auth = useContext(authContext);

  useEffect(() => {
    setIsLoading(true);
    API.fetchListingDetails(auth, listingId)
      .then(setListing)
      .catch((e) => {
        console.error(e);
        showError(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Fragment>
      {error && <ErrorMessage errorMessage={error} />}
      {isLoading && <CircularProgress />}
      Loaded!
    </Fragment>
  );
}

export default (
  AppNavWrapper({ title: 'Edit Listing' })(EditListingDetails)
);