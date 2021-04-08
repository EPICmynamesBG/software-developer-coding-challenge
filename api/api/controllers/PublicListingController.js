'use strict';

const AccountListingService = require('../services/AccountListingService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');

class PublicListingController extends BaseController {
  constructor() {
    super(AccountListingService);
    this.pagination = true;
  }

  static get BaseRoute() {
    return '/listings';
  }

  static get Name() {
    return 'AccountListing';
  }

  static get supportsDelete() { return false; }
  static get supportsUpdate() { return false; }

  static get Security() {
    return {
      [this.BaseRoute]: {
        get: [],
        post: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}`]: {
        get: []
      }
    };
  }
}

const instance = new PublicListingController();

module.exports = {
  constructor: PublicListingController,
  getAll: instance.getAllByPathIds.bind(instance),
  getById: instance.getByPathIds.bind(instance),
  create: instance.createWithPathIds.bind(instance)
};
