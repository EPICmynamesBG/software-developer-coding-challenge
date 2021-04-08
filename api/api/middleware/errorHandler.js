'use strict';

const _ = require('lodash');
const logger = require('../helpers/logger');
// const utils = require('../helpers/utils');

/**
 *
 * @param  {Error}   [err]
 * @param  {Request}   req
 * @param  {Response}   res
 * @param  {Function} next  call next middleware
 * @return {undefined}
 */
function handle(err, req, res, next) {
  if (_.isError(err)) {
    // TODO: Build a more descriptive message for Sentry?
    logger.error(err);
    logger.error(_.get(err, 'results.errors'), []);
    if (err.failedValidation) {
      // TODO: Build a better error response to send?
      res
        .status(400)
        .json({ statusCode: 400, message: 'Bad Request' })
        .end();
      return;
    }
  }
  next();
}

module.exports = handle;
