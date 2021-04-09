import { apiRequest, authenticatedApiRequest } from './Helpers';

export const PAGE_SIZE = 50;

export const LoginURI = `${process.env.REACT_APP_API_URI}/accounts/login`;

export function Login(email, password) {
  return apiRequest(LoginURI, "POST", {
    email,
    password
  });
}

export function Me(authContext) {
  const url = `${process.env.REACT_APP_API_URI}/accounts/me`;
  return authenticatedApiRequest(authContext, url, "GET");
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

export function fetchMarketListings(page = 0, pageSize = PAGE_SIZE, sort = '+id', filters = []) {
  const url = `${process.env.REACT_APP_API_URI}/listings`;
  return apiRequest(url, "GET", undefined, {
    filters: filters,
    pageSize: pageSize,
    page: page,
    sort: [sort]
  });
}

export function fetchAccountListings(authContext, accountId,page = 0, pageSize = PAGE_SIZE, sort = '+id', filters = []) {
  const url = `${process.env.REACT_APP_API_URI}/accounts/${accountId}/listings`;
  return authenticatedApiRequest(authContext, url, "GET", {
    filters: filters,
    pageSize: pageSize,
    page: page,
    sort: [sort]
  });
}
