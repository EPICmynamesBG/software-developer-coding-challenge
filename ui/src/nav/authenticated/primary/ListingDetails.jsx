import * as React from 'react';

import { useParams } from "react-router-dom";


export default function ListingDetails() {
  const { listingId } = useParams();
  return <h3>Requested listing ID: {listingId}</h3>
}