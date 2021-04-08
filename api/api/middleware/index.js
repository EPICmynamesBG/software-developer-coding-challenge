'use strict';

const cors = require('cors');
const swaggerUi = require('swagger-tools/middleware/swagger-ui');
const swaggerMetadata = require('swagger-tools/middleware/swagger-metadata');
const swaggerRouter = require('swagger-tools/middleware/swagger-router');
const swaggerValidator = require('swagger-tools/middleware/swagger-validator');

const authorization = require('./auth');
const errorHandler = require('./errorHandler');

const corsOptions = {
  origin: process.env.APP_URI
};

const beforeSwagger = function (app) {
  app.disable('x-powered-by');
};

const afterSwagger = function (app, swagger) {
  const options = {
    cors: true,
    controllers: './api/controllers',
    useStubs: false
  };

  app.use(cors(corsOptions));

  // Puts the `swagger` on req
  app.use(swaggerMetadata(swagger));

  // app.use(routeLogging);
  app.use(authorization);

  app.use(swaggerValidator());

  app.use(errorHandler);

  app.use(swaggerRouter(options));
  if (process.env.NODE_ENV === 'development') app.use(swaggerUi(swagger));
};

module.exports = {
  beforeSwagger,
  afterSwagger
};
