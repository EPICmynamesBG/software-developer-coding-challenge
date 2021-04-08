import * as React from "react";

import AppNavWrapper from '../../../hoc/AppNavWrapper';

function MyListings() {
  return (
    <div>
      Logs
    </div>
  )
}

export default (AppNavWrapper({ title: 'My Listings' })(MyListings));
