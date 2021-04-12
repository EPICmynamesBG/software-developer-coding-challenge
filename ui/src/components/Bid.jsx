import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  bidBody: {
    display: 'block',
    borderTop: '1px solid gray',
    '& > *': {
      margin: 10
    }
  }
})

export default function Bid(bidProps) {
  const {
    bid,
    account = {},
    createdAt
  } = bidProps;
  const classes = useStyles();
  return (
    <span className={classes.bidBody}>
      <Typography variant="subtitle1">
        ${bid}
      </Typography>
      <Typography variant="caption">
        {account.email}
      </Typography>
      <Typography variant="subtitle2">
        {createdAt}
      </Typography>
    </span>
  );
}