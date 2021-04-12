import * as React from 'react';

function FormStateCacheHOC(Component, { formName }) {
  const name = `${formName}_State`;
  const restoreFormState = JSON.parse(localStorage.getItem(name) || '{}');

  const cacheFormState = (state = {}) => {
    localStorage.setItem(name, JSON.stringify(state));
  };

  const clearFormCache = () => {
    localStorage.setItem(name, '{}');
  };


  return props => (
    <Component formCache={{
      state: restoreFormState,
      saveState: cacheFormState,
      clearState: clearFormCache
    }} {...props} />
  );
}

export default FormStateCacheHOC;
