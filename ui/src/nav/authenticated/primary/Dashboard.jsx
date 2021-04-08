import * as React from "react";

import AppNavWrapper from '../../../hoc/AppNavWrapper';

function Dashboard() {
  return (
    <div>
      Dashboard
    </div>
  )
}

export default (AppNavWrapper({ title: 'Dashboard' })(Dashboard));
