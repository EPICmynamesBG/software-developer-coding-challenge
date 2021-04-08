'use strict';

const uuid = require('uuid');
const JWT = require('../helpers/JWT');

function generateToken(account) {
  const payload = {
    email: account.email
  };
  return JWT.sign(payload, { jwtid: uuid.v4() });
}

function refreshToken(token) {
  let refreshed;
  try {
    refreshed = JWT.refresh(token, { jwtid: uuid.v4() });
  } catch (e) {
    return e;
  }
  return refreshed;
}

function validateToken(token) {
  let verified;
  try {
    verified = JWT.verify(token);
  } catch (e) {
    return e;
  }
  return verified;
}

module.exports = {
  generateToken,
  refreshToken,
  validateToken
};
