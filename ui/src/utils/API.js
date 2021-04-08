import { apiRequest, authenticatedApiRequest } from './Helpers';

export const PAGE_SIZE = 50;

export const LoginURI = `${process.env.REACT_APP_API_URI}/accounts/login`;

export function Login(email, password) {
  return apiRequest(LoginURI, "POST", {
    email,
    password
  });
}

export function Me(token) {
  const url = `${process.env.REACT_APP_API_URI}/accounts/me`;
  return authenticatedApiRequest(token, url, "GET");
}

/**
 * Placeholder method for server side logout
 * @async
 */
export async function Logout() {
  return true;
}

export function CreateAccount(email, password, confirmPassword) {
  const url = `${process.env.REACT_APP_API_URI}/accounts`;
  return apiRequest(url, "POST", {
    email,
    password,
    confirmPassword
  });
}

export function ForgotPassword(email) {
  const url = `${process.env.REACT_APP_API_URI}/accounts/forgot`;
  return apiRequest(url, "POST", {
    email
  });
}

export function fetchMarketListings(token, page = 0, sort = '+id') {
  const url = `${process.env.REACT_APP_API_URI}/listings`;
  return authenticatedApiRequest(token, url, "GET", {
    filter: {
      active: true
    },
    pageSize: PAGE_SIZE,
    page: page,
    sort: [sort]
  });
}

export function fetchAccountListings(token, accountId, page = 0, sort = '-createdAt') {
  const url = `${process.env.REACT_APP_API_URI}/accounts/${accountId}/listings`;
  return authenticatedApiRequest(token, url, "GET", {
    pageSize: PAGE_SIZE,
    page: page,
    sort: [sort]
  });
}
