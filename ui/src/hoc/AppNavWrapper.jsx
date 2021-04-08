import * as React from "react";
import { useEffect } from "react";

import NavBar from '../components/NavBar';
import Footer from '../root/Footer';

const { useState } = React;

function AppNavWrapper({
  title,
  className = 'app'
}) {
  return (Component) => {
    return function BodyWrappedComponent(props) {
      const [pageTitle, setPageTitle] = useState(title);
      const [pageClass, setPageClass] = useState(className);

      useEffect(() => {
        window.document.title = pageTitle;
      }, [pageTitle]);

      return (
        <>
          <NavBar
            pageTitle={pageTitle}
            pageClass={pageClass}
          >
            <Component {...props} setPageTitle={setPageTitle} setPageClass={setPageClass} />
          </NavBar>
          <Footer></Footer>
        </>
      );
    }
  };
}

export default AppNavWrapper;
