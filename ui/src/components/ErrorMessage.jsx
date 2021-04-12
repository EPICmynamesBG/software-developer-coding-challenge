import * as React from "react";

function ErrorMessageContainer({ errorMessage }) {
  return <p style={{
    "textAlign": "center",
    "marginTop": "10px",
    "color": "#ff0000"
  }}>{errorMessage}</p>;
}

export default ErrorMessageContainer;
