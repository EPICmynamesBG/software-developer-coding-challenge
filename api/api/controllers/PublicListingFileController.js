'use strict';

const _ = require('lodash');
const FileController = require('./FileController');

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
}

const instance = new PublicListingFileController();

module.exports = {
  constructor: PublicListingFileController,
  getAll: instance.getAllByPathIds.bind(instance),
  getById: instance.getByPathIds.bind(instance),
  create: instance.createWithPathIds.bind(instance)
};
