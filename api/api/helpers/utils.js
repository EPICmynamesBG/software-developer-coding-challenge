'use strict';

const _ = require('lodash');
const moment = require('moment');
const crypto = require('crypto-js');
const { promisify } = require('util');
const { ENCRYPTION_KEY } = require('../../config/config');
const nativeLogger = require('./logger');

/**
 * Encrypt anything
 * @param  {any} thing
 * @return {string}
 */
function encrypt(thing) {
  if (_.isNil(thing) || _.isEmpty(thing)) {
    throw new Error('Cannot encrypt nil/empty thing!');
  } else if (_.isString(thing)) {
    return crypto.AES.encrypt(thing, ENCRYPTION_KEY).toString();
  } else {
    return crypto.AES.encrypt(JSON.stringify(thing), ENCRYPTION_KEY).toString();
  }
}

/**
 * Decrypt a string
 * @param  {string} thing
 * @param  {boolean} [isObject = false]
 * @return {string|object}
 */
function decrypt(thing, isObject = false) {
  if (!_.isString(thing) || _.isEmpty(thing)) {
    throw new Error('Decrypt requires an encrypted string!');
  } else {
    const decrypted = crypto.AES.decrypt(thing, ENCRYPTION_KEY).toString(crypto.enc.Utf8);
    if (_.isEmpty(decrypted)) {
      throw new Error('Unencrypted input');
    }
    return isObject ? JSON.parse(decrypted) : decrypted;
  }
}

/**
 * @class
 * @extends Error
 */
class HttpError extends Error {
  /**
   * @constructor
   * @param {string} message
   * @param {Number} [statusCode=500]
   * @param {string} action
   */
  constructor(message, statusCode = 500, action) {
    super(message);
    this.statusCode = statusCode;
    if (action) this.action = _.toUpper(action);
  }
}

/**
 * Handle Database errors and cast them to more readable errors
 * @param  {Error} [err]
 * @return {HttpError}
 */
function handleDbError(err) {
  const defErr = new HttpError('Internal error', 500);
  if (!err) {
    return defErr;
  } if (err instanceof HttpError || err.statusCode) {
    return err;
  } if (err.code === '23505') {
    // TODO: comment here with postgres err codes link
    return new HttpError(err.detail, 409);
  }
  return defErr;
}

/**
 * Snake case object keys in collection, recursively
 * @param  {any} collection
 * @return {any}
 */
function snakeCaseKeys(collection) {
  let results = _.cloneDeep(collection);
  if (_.isArray(results)) {
    results = _.map(results, (obj) => snakeCaseKeys(obj));
  } else if (_.isObject(results)
    && !_.isDate(results)
    && !(results instanceof moment)) {
    results = _.reduce(
      results, (obj, value, key) => _.set(obj, _.snakeCase(key), snakeCaseKeys(value)),
      {}
    );
  }
  return results;
}

/**
 * Camel case object keys in collection, recursively
 * @param  {any} collection
 * @return {any}
 */
function camelCaseKeys(collection) {
  let results = _.cloneDeep(collection);
  if (_.isArray(results)) {
    results = _.map(results, (obj) => camelCaseKeys(obj));
  } else if (_.isObject(results)
    && !_.isDate(results)
    && !(results instanceof moment)) {
    results = _.reduce(
      results, (obj, value, key) => _.set(obj, _.camelCase(key), camelCaseKeys(value)),
      {}
    );
  }
  return results;
}

/**
 * Cast objection models to plain objects
 * @param  {objection.Model|objection.Model[]} collection
 * @return {object|object[]}
 */
function jsonify(collection) {
  let results = _.cloneDeep(collection);
  if (_.isArray(results)) {
    results = _.map(results, (obj) => jsonify(obj));
  } else if (_.isObject(results)) {
    if (_.isFunction(results.$toJson)) {
      results = results.$toJson();
    } else {
      results = _.mapValues(collection, jsonify);
    }
  }
  return results;
}

/**
 * @param  {} err      [description]
 * @param  {[type]} results  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
function handleResponse(err, results, response) {
  if (!err && results) {
    let json = module.exports.jsonify(results);
    json = module.exports.camelCaseKeys(json);

    if (_.isEmpty(json)) {
      response.status(204).json().end();
      return;
    } if (_.get(json, 'action') === 'CREATE') {
      response.status(201).json(json).end();
      return;
    }
    response.status(200).json(json).end();
    return;
  }
  nativeLogger.error(err);
  const { statusCode, message, ...etc } = module.exports.handleDbError(err);
  response.status(statusCode).json({ statusCode, message, ...etc }).end();
}

/**
 * @param  {[type]} logger [description]
 * @param  {[type]} args   [description]
 * @return {[type]}        [description]
 */
function wrapLogger(logger, ...args) {
  if (logger._wrapped) return logger;
  // eslint-disable-next-line no-param-reassign
  logger._wrapped = true;
  [
    'silly', 'debug', 'verbose', 'info',
    'warn', 'error', 'fatal'
  ].forEach((level) => {
    const orig = logger[level];
    // eslint-disable-next-line no-param-reassign
    logger[level] = (...log) => orig(...args, ...log);
  });
  return logger;
}

/**
 * promisify a callback method that may respond with multiple success args
 * @param  {function} method
 * @return {AsyncFunction}
 */
function promisifyMultiArgCallback(method) {
  // eslint-disable-next-line no-param-reassign
  method[promisify.custom] = (...args) => new Promise((resolve, reject) => {
    method(...args, (err, ...etc) => {
      if (err) reject(err);
      else if (etc.length > 1) resolve(etc);
      else resolve(...etc);
    });
  });
  return promisify(method);
}

function cleanseFileName(fileName, originalFileName) {
  const fileEnding = _.last(originalFileName.split('.'));
  if (!fileName.includes(fileEnding)) {
    return fileName.concat('.').concat(fileEnding);
  }
  return fileName;
}

module.exports = {
  encrypt,
  decrypt,
  HttpError,
  handleDbError,
  handleResponse,
  camelCaseKeys,
  snakeCaseKeys,
  jsonify,
  wrapLogger,
  promisifyMultiArgCallback,
  cleanseFileName
};
