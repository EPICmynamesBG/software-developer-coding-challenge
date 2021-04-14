'use strict';

const AccountListingService = require('../services/AccountListingService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');
const nhtsa = require('../services/nhtsa');
const { snakeCaseKeys } = require('../helpers/utils');

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

  static get supportsCountAll() { return true; }

  static get Security() {
    return {
      [this.BaseRoute]: {
        get: [ROLES.STANDARD],
        post: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/count`]: {
        get: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}`]: {
        get: [ROLES.STANDARD],
        put: [ROLES.STANDARD],
        delete: [ROLES.STANDARD]
      }
    };
  }

  async create(req, res) {
    const createObj = { ...snakeCaseKeys(req.body) };
    if (!createObj.vehicle_nhtsa_info) {
      const { data } = await nhtsa.decodeVinExtended(createObj.vehicle_vin);
      const formatted = nhtsa.formatVinDecode(data);
      createObj.vehicle_nhtsa_info = snakeCaseKeys(formatted);
    }
    return this.responder('create', res, () => this.service.create(createObj));
  }

  async createWithPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req, this.constructor.omitPathVars);
    const createObj = { ...snakeCaseKeys(req.body), ...pathIds };
    if (!createObj.vehicle_nhtsa_info) {
      const { data } = await nhtsa.decodeVinExtended(createObj.vehicle_vin);
      const formatted = nhtsa.formatVinDecode(data);
      createObj.vehicle_nhtsa_info = snakeCaseKeys(formatted);
    }
    return this.responder('create', res, () => this.service.create(createObj));
  }
}

const instance = new AccountListingController();

module.exports = {
  constructor: AccountListingController,
  getAll: instance.getAllByPathIds.bind(instance),
  getById: instance.getByPathIds.bind(instance),
  countAll: instance.countAllByPathIds.bind(instance),
  create: instance.createWithPathIds.bind(instance),
  updateById: instance.updateByPathIds.bind(instance),
  deleteById: instance.deleteByPathIds.bind(instance)
};
