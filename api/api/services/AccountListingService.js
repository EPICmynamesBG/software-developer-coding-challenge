'use strict';

const AccountListing = require('../models/AccountListing');
const BaseService = require('./BaseService');

class AccountListingService extends BaseService {
  constructor() {
    super(AccountListing);
  }
}

module.exports = new AccountListingService();
