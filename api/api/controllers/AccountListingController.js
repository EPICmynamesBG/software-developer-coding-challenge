'use strict';

const AccountListingService = require('../services/AccountListingService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');

class AccountListingController extends BaseController {
  constructor() {
    super(AccountListingService);
  }

  static get BaseRoute() {
    return '/accounts/{accountId}/listings';
  }

  static get Name() {
    return 'AccountListing';
  }

  static get Security() {
    return {
      [this.BaseRoute]: {
        get: [ROLES.STANDARD],
        post: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}`]: {
        get: [ROLES.STANDARD],
        put: [ROLES.STANDARD],
        delete: [ROLES.STANDARD]
      }
    };
  }
}

const instance = new AccountListingController();

module.exports = {
  constructor: AccountListingController,
  getAll: instance.getAllByPathIds.bind(instance),
  getById: instance.getByPathIds.bind(instance),
  create: instance.createWithPathIds.bind(instance),
  updateById: instance.updateByPathIds.bind(instance),
  deleteById: instance.deleteByPathIds.bind(instance)
};
