'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_PUBLIC } = require('../../config/config');

const JWT_OPTS = {
  algorithm: 'HS256',
  keyid: '1',
  noTimestamp: false,
  expiresIn: '15 minutes'
};

class JWT {
  constructor(privateKey, publicKey, options = {}) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.options = options;
  }

  sign(payload, signOptions = {}) {
    const opts = { ...this.options, ...signOptions };
    return jwt.sign(payload, this.privateKey, opts);
  }

  refresh(token, refreshOptions = {}) {
    const payload = jwt.verify(token, this.privateKey, refreshOptions.verify);
    console.log(payload);
    ['iat', 'exp', 'nbf', 'jti'].map(prop => _.unset(payload, prop));
    const jwtSignOptions = { ...this.options, jwtid: refreshOptions.jwtid };
    return jwt.sign(payload, this.privateKey, jwtSignOptions);
  }

  verify(token, callback) {
    if (callback) {
      return jwt.verify(token, this.privateKey, {}, callback);
    }
    return jwt.verify(token, this.privateKey);
  }
}

module.exports = new JWT(JWT_SECRET, JWT_PUBLIC, JWT_OPTS);
