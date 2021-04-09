import * as validator from "validator";


class HttpError extends Error {
  constructor(message, statusCode = 500, response) {
    super(message);
    this.statusCode = statusCode;
    this._response = response;
  }
}

/** Handle form validation for the login form
 * @param email - user's auth email
 * @param password - user's auth password
 * @param setError - function that handles updating error state value
 */
export const validateLoginForm = (
  email,
  password,
  setError = () => {}
) => {
  // Check for undefined or empty input fields
  if (!email || !password) {
    setError("Please enter a valid email and password.");
    return false;
  }

  // Validate email
  if (!validator.isEmail(email)) {
    setError("Please enter a valid email address.");
    return false;
  }

  return true;
};

/**
 * Return user auth from local storage value
 * @returns {UserAuth}
 */
export const getStoredUserAuth = () => {
  const auth = window.localStorage.getItem("UserAuth");
  if (auth) {
    return JSON.parse(auth);
  }
  return null;
};

/**
 * API Request handler
 * @param {string} url - api endpoint
 * @param {string} method - http method
 * @param {object} bodyParams - body parameters of request
 * @param {object} [headers = {}]
 */
export const apiRequest = async (url, method, bodyParams, queryParams, headers = {}) => {
  const urlObject = new URL(url);
  urlObject.search = new URLSearchParams(queryParams).toString();
  const response = await fetch(urlObject, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers
    },
    body: bodyParams ? JSON.stringify(bodyParams) : undefined
  });

  const res = await response;
  if (res.status >= 200 && res.status < 300) {
    return response.json();
  }
  const body = response.json();
  throw new HttpError(body.message, response.statusCode, response);
};

/**
 * @param  {string}  token
 * @param  {string}  url
 * @param  {string}  method
 * @param  {Object}  queryParams
 * @param  {Object}  bodyParams
 * @param  {Object}  [headers={}]
 * @return {Promise}
 */
export const authenticatedApiRequest = async (token, url, method, queryParams, bodyParams, headers = {}) => {
  try {
    return await apiRequest(url, method, bodyParams, queryParams, { Authorization: `Bearer ${token}`, ...headers });
  } catch (e) {
    if (e.statusCode === 403) {
      window.localStorage.setItem("UserAuth", undefined);
      return;
    }
    throw e;
  }
}
