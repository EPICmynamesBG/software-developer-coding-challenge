import * as React from 'react';

import { useParams, Link } from "react-router-dom";
import { authContext } from './../../../contexts/AuthContext';
import * as API from '../../../utils/API';
import AppNavWrapper from '../../../hoc/AppNavWrapper';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';


/** Presentation */
import ErrorMessage  from "../../../components/ErrorMessage";

/** Custom Hooks */
import useErrorHandler from "../../../utils/custom-hooks/ErrorHandler";

import ViewListingDetails from './listingDetails/ViewListingDetails';
import { CircularProgress, IconButton } from '@material-ui/core';

const { useEffect, useState, useContext, Fragment } = React;

const useStyles = makeStyles((theme) => ({
  editIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 15
  }
}));

function ListingDetails() {
  const [listing, setListing] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { error, showError } = useErrorHandler(null);
  const { listingId } = useParams();
  const auth = useContext(authContext);
  const classes = useStyles();

  useEffect(() => {
    setIsLoading(true);
    API.fetchListingDetails(listingId)
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
      {auth.auth && listing && auth.auth.id === listing.accountId && <div className={classes.editIcon}>
          <Link to={`/my-listings/${listingId}/edit`}>
            <IconButton color="primary" aria-label="edit">
              <EditIcon />
            </IconButton>
          </Link>
        </div>}
      {listing && <ViewListingDetails listing={listing} />}
    </Fragment>
  );
}

export default (
  AppNavWrapper({ title: 'Listing' })(ListingDetails)
);