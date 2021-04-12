'use strict';

const _ = require('lodash');
const FileController = require('./FileController');
const { snakeCaseKeys } = require('../helpers/utils');

class PublicListingFileController extends FileController {
  constructor() {
    super([
      'listing',
      props => (_.get(props, _.snakeCase('accountListingId')))
    ]);
  }

  static get supportsUpdate() { return false; }
  static get supportsDelete() { return false; }

  static get BaseRoute() {
    return '/listings/{accountListingId}/files';
  }

  createWithPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req);
    const createObj = { ...req.body, ...pathIds, account_id: req.account.id };
    console.log(createObj);
    const file = req.files.upfile[0];
    return this.responder('create', res, () => this.service.create(file, snakeCaseKeys(createObj)));
  }
}

const instance = new PublicListingFileController();

module.exports = {
  constructor: PublicListingFileController,
  getAll: instance.getAllByPathIds.bind(instance),
  getById: instance.getByPathIds.bind(instance),
  create: instance.createWithPathIds.bind(instance),
  renderFile: instance.renderFile.bind(instance)
};
