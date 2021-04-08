'use strict';

const _ = require('lodash');
const knex = require('knex');
const config = require('./config');
const models = require('../api/models');

class DB {
  constructor() {
    this.knex = knex({
      client: 'pg',
      connection: config.DATABASE_CONN_DETAILS
    });
  }

  initModels() {
    _.forEach(models, (model) => {
      model.knex(this.knex);
    });
  }
}

const globalDb = new DB();

module.exports = globalDb;
