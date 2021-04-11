'use strict';

const _ = require('lodash');
const FileController = require('./FileController');

class AccountListingFileController extends FileController {
  constructor() {
    super([
      'account',
      props => (_.get(props, _.snakeCase('accountId'))),
      'listing',
      props => (_.get(props, _.snakeCase('accountListingId')))
    ]);
  }

  static get BaseRoute() {
    return '/accounts/{accountId}/listings/{accountListingId}/files';
  }
}

const instance = new AccountListingFileController();

module.exports = {
  constructor: AccountListingFileController,
  getAll: instance.getAllByPathIds.bind(instance),
  getById: instance.getByPathIds.bind(instance),
  create: instance.createWithPathIds.bind(instance),
  updateById: instance.updateByPathIds.bind(instance),
  deleteById: instance.deleteByPathIds.bind(instance)
};
