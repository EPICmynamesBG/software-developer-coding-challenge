import * as React from 'react';


export default function NhtsaPreview(props) {
  const {
    make,
    model,
    modelYear,
    engineConfiguration,
    engineNumberOfCylinders,
    trim
  } = props;


  return (
    <div>
      <span>
        <b>{modelYear} {make} {model}</b>
      </span>
      <span>
        <i>{trim}</i>
      </span>
      <div>
        Engine: {engineConfiguration} {engineNumberOfCylinders}
      </div>
    </div>
  )
}