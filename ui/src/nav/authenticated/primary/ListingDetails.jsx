import * as React from 'react';

import { useParams, useHistory } from "react-router-dom";
import { authContext } from './../../../contexts/AuthContext';
import * as API from '../../../utils/API';
import AppNavWrapper from '../../../hoc/AppNavWrapper';

/** Presentation */
import ErrorMessage  from "../../../components/ErrorMessage";

/** Custom Hooks */
import useErrorHandler from "../../../utils/custom-hooks/ErrorHandler";

import ViewListingDetails from './listingDetails/ViewListingDetails';
import { CircularProgress } from '@material-ui/core';

const { useEffect, useState, useContext, Fragment } = React;

function ListingDetails() {
  const [listing, setListing] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { error, showError } = useErrorHandler(null);
  const { listingId } = useParams();
  const history = useHistory();
  const auth = useContext(authContext);

  const fetchDetails = auth.auth
    ? id => API.fetchMyListingDetails(auth, id)
    : id => API.fetchListingDetails(id);

  useEffect(() => {
    setIsLoading(true);
    fetchDetails(listingId)
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
      {listing && <ViewListingDetails listing={listing} />}
    </Fragment>
  );
}

export default (
  AppNavWrapper({ title: 'Listing' })(ListingDetails)
);