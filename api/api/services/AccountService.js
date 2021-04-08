'use strict';

const Account = require('../models/Account');
const BaseService = require('./BaseService');

class AccountService extends BaseService {
  constructor() {
    super(Account);
  }
}

module.exports = new AccountService();
