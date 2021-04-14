'use strict';

const swaggerParser = require('swagger-parser');
const express = require('express');
const config = require('./config/config');

const DB = require('./config/db');
const middleware = require('./api/middleware');
const logger = require('./api/helpers/logger');

DB.initModels();

const app = express();

middleware.beforeSwagger(app);

swaggerParser.validate('./api/swagger/swagger.yaml', (err, api) => {
  if (err) throw err;

  middleware.afterSwagger(app, api);

  const port = config.PORT;
  app.server = app.listen(port, () => {
    logger.verbose('App running on port', port);
    app.emit('ready', null);
  });
});

module.exports = app;
