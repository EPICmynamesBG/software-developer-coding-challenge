'use strict';

const _ = require('lodash');
const authService = require('../services/authService');
const { HttpError, handleResponse } = require('../helpers/utils');
const { ROLES, ROLE_HEIRARCHY } = require('../helpers/constants');
const Account = require('../models/Account');


module.exports = async (req, res, next) => {
  const operation = _.get(req, 'swagger.operation', {});
  if (operation.security || req.headers.authorization) {
    const regex = /^Bearer (.+)$/g;
    const auth = _.get(req, 'headers.authorization', '');
    const token = _.get(regex.exec(auth), '[1]', null);

    if (!token) {
      handleResponse(new HttpError('Unauthorized', 401), null, res);
      return;
    }
    const validated = authService.validateToken(token);
    if (_.isError(validated)) {
      handleResponse(new HttpError(validated.message, 403), null, res);
      return;
    }

    const endpointRolesRequired = _.get(operation, 'x-trdrev-api-security-roles', []);

    try {
      const account = await Account.getByEmail(validated.email);
      if (!_.isEmpty(endpointRolesRequired)) {
        const roleKey = _.invert(ROLES)[account.role];
        const permissions = ROLE_HEIRARCHY[roleKey];
        if (_.isEmpty(_.intersection(endpointRolesRequired, permissions))) {
          throw new HttpError('Unauthorized', 403);
        }

        const pathAccountId = _.get(req, 'swagger.params.accountId');
        if (pathAccountId &&
          (account.role === ROLES.STANDARD && pathAccountId.value !== account.id)
        ) {
          //  User trying to access another's resource
          throw new HttpError('Unauthorized', 403);
        }
      }
      req.account = account;
      req.token = token;
    } catch (err) {
      handleResponse(err, null, res);
      return;
    }
  }
  return next();
};
