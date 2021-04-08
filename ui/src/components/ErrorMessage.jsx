import * as React from "react";

function ErrorMessageContainer({ errorMessage }) {
  return <p style={{
    "text-align": "center",
    "margin-top": "10px",
    "color": "#ff0000"
  }}>{errorMessage}</p>;
}

export default ErrorMessageContainer;
