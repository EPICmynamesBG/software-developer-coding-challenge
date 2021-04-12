import { lighten, makeStyles, Typography } from '@material-ui/core';
import * as React from 'react';
import get from 'lodash/get';
import BidList from '../../../../components/BidList';
import CreateBidForm from '../../../../components/CreateBidForm';
import Bid from '../../../../components/Bid';

const { useState } = React;

const useStyles = makeStyles(theme => ({
  root: {
    padding: 15,
    '& > *': {
      margin: 10
    }
  },
  photoBlock: {
    height: 100
  },
  infoBlock: {

  },
  winningBid: {
    backgroundColor: lighten(theme.palette.secondary.light)
  }
}));

export default function ViewListingDetails({ listing }) {
  const {
    vehicleVin,
    display = {},
    vehicleNhtsaInfo = {},
    isActive,
    isComplete,
    winningBid = {}
  } = listing;
  console.log(listing);
  const classes = useStyles();
  const [created, setCreated] = useState([]);

  const onBidCreate = (createdBid) => {
    setCreated([createdBid, ...created]);
  };

  return (
    <div className={classes.root}>
      <Typography color="inherit" variant="h3">
        {display.title}
      </Typography>
      {!isComplete && !isActive && <Typography color="inherit" variant="subtitle2">
        This listing is not yet live
      </Typography>}
      {isComplete && <Typography color="inherit" variant="subtitle2">
        This listing is no longer active
      </Typography>}
      {isComplete && winningBid && <Bid className={classes.winningBid} {...winningBid} />}
      <Typography color="inherit" variant="h6">
        {vehicleVin}
      </Typography>
      <div className={classes.photoBlock}>

      </div>
      <div className={classes.infoBlock}>
        {Object.keys(vehicleNhtsaInfo).map((key) => {
          return (
            <div key={key}>
              <Typography color="inherit" variant="b">
                {key}
              </Typography>
              <Typography color="inherit" variant="p">
                {vehicleNhtsaInfo[key]}
              </Typography>
            </div>
          )
        })}
      </div>
      <Typography color="inherit" variant="body1">
        {display.description || "(No description provided)"}
      </Typography>
      <BidList listingId={listing.id} appendData={created} />
      <CreateBidForm listingId={listing.id} currentMaxBid={get(listing, 'winningBid.bidValue')} onBidCreate={onBidCreate} />
    </div>
  );
}