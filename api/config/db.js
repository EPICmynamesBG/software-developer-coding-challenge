'use strict';

const _ = require('lodash');
const knex = require('knex');
const config = require('./config');
const models = require('../api/models');

class DB {
  constructor() {
    this.knex = knex({
      client: 'pg',
      connection: config.DATABASE_CONN_DETAILS,
      debug: process.env.NODE_ENV === 'development' && process.env.DEBUG_QUERIES === 'true',
      asyncStackTraces: true,
      pool: {
        min: 1,
        max: 20,
        afterCreate(conn, done) {
          conn.query('SET timezone="UTC";', (err) => {
            done(err, conn);
          });
        }
      }
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
