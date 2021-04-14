'use strict';

const ListingBidService = require('../services/ListingBidService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');
const { snakeCaseKeys } = require('../helpers/utils');

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
        get: [],
        post: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}`]: {
        get: []
      }
    };
  }

  create(req, res) {
    const payload = {
      ...req.body,
      account_id: req.account.id
    };
    return this.responder('create', res, this.service.create(payload));
  }

  createWithPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req, this.constructor.omitPathVars);
    const createObj = { ...snakeCaseKeys(req.body), ...pathIds, account_id: req.account.id };
    return this.responder('create', res, () => this.service.create(createObj));
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
