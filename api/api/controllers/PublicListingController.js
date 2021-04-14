'use strict';

const AccountListingService = require('../services/AccountListingService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');
const nhtsa = require('../services/nhtsa');
const { snakeCaseKeys } = require('../helpers/utils');

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

  static get supportsCountAll() { return true; }

  static get Security() {
    return {
      [this.BaseRoute]: {
        get: [],
        post: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/count`]: {
        get: []
      },
      [`${this.BaseRoute}/{id}`]: {
        get: []
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

const instance = new PublicListingController();

module.exports = {
  constructor: PublicListingController,
  getAll: instance.getAllByPathIds.bind(instance),
  getById: instance.getByPathIds.bind(instance),
  countAll: instance.countAllByPathIds.bind(instance),
  create: instance.createWithPathIds.bind(instance)
};
