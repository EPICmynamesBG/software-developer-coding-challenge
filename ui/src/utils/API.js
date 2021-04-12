import { apiRequest, authenticatedApiRequest, fileUploadRequest } from './Helpers';

export const PAGE_SIZE = 50;

export const LoginURI = `${process.env.REACT_APP_API_URI}/accounts/login`;

export function Login(email, password) {
  return apiRequest(LoginURI, "POST", {
    email,
    password
  });
}

export function Refresh(authContext) {
  const url = `${process.env.REACT_APP_API_URI}/accounts/refresh`;
  return authenticatedApiRequest(authContext, url, "GET");
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
  const queryParams = {
    pageSize: pageSize,
    page: page,
    sort: [sort]
  };
  if (filters.length) {
    queryParams.filters = filters;
  }
  const url = `${process.env.REACT_APP_API_URI}/listings`;
  return apiRequest(url, "GET", undefined, queryParams);
}

export function fetchAccountListings(authContext, page = 0, pageSize = PAGE_SIZE, sort = '+id', filters = []) {
  const queryParams = {
    pageSize: pageSize,
    page: page,
    sort: [sort],
    include: ['photos']
  };
  if (filters.length) {
    queryParams.filters = filters;
  }
  const url = `${process.env.REACT_APP_API_URI}/accounts/${authContext.auth.id}/listings`;
  return authenticatedApiRequest(authContext, url, "GET", queryParams);
}

export function fetchListingDetails(listingId) {
  const url = `${process.env.REACT_APP_API_URI}/listings/${listingId}`;
  return apiRequest(url, "GET", undefined, {
    include: ['photos', 'winningBid']
  });
}

export function fetchMyListingDetails(authContext, listingId) {
  const url = `${process.env.REACT_APP_API_URI}/accounts/${authContext.auth.id}/listings/${listingId}`;
  return authenticatedApiRequest(authContext, url, "GET", {
    include: ['photos', 'winningBid']
  });
}

export function CreateListing(authContext, listingData = {}) {
  const url = `${process.env.REACT_APP_API_URI}/accounts/${authContext.auth.id}/listings`;
  return authenticatedApiRequest(authContext, url, "POST", undefined, listingData);
}

export function fetchBids(listingId, page = 0, pageSize = PAGE_SIZE, sort = '-createdAt', filters = []) {
  const queryParams = {
    pageSize: pageSize,
    page: page,
    sort: [sort],
    include: ['account']
  };
  if (filters.length) {
    queryParams.filters = filters;
  }
  const url = `${process.env.REACT_APP_API_URI}/listings/${listingId}/bids`;
  return apiRequest(url, "GET", undefined, queryParams);
}

export function CreateBid(authContext, listingId, bidData = {}) {
  const url = `${process.env.REACT_APP_API_URI}/listings/${listingId}/bids`;
  return authenticatedApiRequest(authContext, url, "POST", undefined, bidData);
}

export function LookupVIN(vin) {
  if (!vin) {
    return Promise.reject(new Error('Missing vin'));
  }
  const url = `${process.env.REACT_APP_API_URI}/vinlookup/${vin}`;
  return apiRequest(url, "GET");
}

/**
 * 
 * @param {object} auth 
 * @param {string} listingId 
 * @param {File} file 
 */
export function UploadListingFile(authContext, listingId, file) {
  const url = `${process.env.REACT_APP_API_URI}/listings/${listingId}/files`;
  const formData = new FormData();
  formData.append('upfile', file);
  formData.append('fileName', file.name);
  return fileUploadRequest(authContext, url, 'POST', formData);
}