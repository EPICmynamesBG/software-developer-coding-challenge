'use strict';

require('dotenv').config({ silent: true });

const config = {
  SALT_ROUNDS: 10,
  PORT: 3000,
  NODE_ENV: 'development'
};
config.HOST_URL = `${process.env.HOST_DOMAIN || 'http://localhost'}:${process.env.PORT || config.PORT}`;

// eslint-disable-next-line no-process-env
Object.assign(config, process.env);

if (process.env.NODE_ENV === 'test') {
  const testConfig = require('./test');
  Object.assign(config, testConfig);
}

module.exports = config;
