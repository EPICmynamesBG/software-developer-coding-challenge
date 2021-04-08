'use strict';

const ListingBidService = require('../services/ListingBidService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');

class ListingBidController extends BaseController {
  constructor() {
    super(ListingBidService);
  }

  static get BaseRoute() {
    return '/listings/{accountListingId}/bids';
  }

  static get Name() {
    return 'ListingBid';
  }

  static get supportsUpdate() { return false; }

  static get Security() {
    return {
      [this.BaseRoute]: {
        get: [ROLES.STANDARD],
        post: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}`]: {
        get: [ROLES.STANDARD],
        delete: [ROLES.STANDARD]
      }
    };
  }
}

const instance = new ListingBidController();

module.exports = {
  constructor: ListingBidController,
  getAll: instance.getAllByPathIds.bind(instance),
  getById: instance.getByPathIds.bind(instance),
  create: instance.createWithPathIds.bind(instance),
  deleteById: instance.deleteByPathIds.bind(instance)
};
