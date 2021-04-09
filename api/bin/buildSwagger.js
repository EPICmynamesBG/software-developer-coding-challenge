'use strict';

const path = require('path');

process.chdir(path.resolve(__dirname, '../api/swagger'));
const _ = require('lodash');
const resolve = require('json-refs').resolveRefs;
const YAML = require('js-yaml');
const fs = require('fs');
const config = require('../config/config');
const packageJson = require('../package.json');

const logger = require('../api/helpers/logger');
const models = require('../api/models');
const controllers = require('../api/controllers');
const { camelCaseKeys } = require('../api/helpers/utils');

const root = YAML.load(fs.readFileSync(path.resolve(__dirname, '../api/swagger/index.yaml')).toString());
const options = {
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent: (res, callback) => {
      callback(null, YAML.load(res.text));
    }
  }
};

const replaceVars = (yaml) => {
  _.forEach(config, (value, key) => {
    yaml = yaml.replace(`{{${_.toLower(key)}}}`, value); // eslint-disable-line no-param-reassign
  });

  const { name, version, description } = packageJson;
  _.forEach({ name, version, description }, (value, key) => {
    yaml = yaml.replace(`{{${key}}}`, value); // eslint-disable-line no-param-reassign
  });
  return yaml;
};

/**
 * Modifies the incoming schema to remove encrypted fields
 * @param {object} schema 
 * @returns the modified schema input
 */
function stripEncrypted(schema) {
  if (schema['x-encrypt']) {
    // Remove internal/encrypted properties from Swagger definition
    schema['x-encrypt'] = _.map(schema['x-encrypt'], _.camelCase);
    _.forEach(schema['x-encrypt'], (property) => {
      _.unset(schema.properties, property);
    });
    schema.required = _.without(schema.required, ...schema['x-encrypt']);
    // Remove the x-encrypt from Swagger definition
    _.unset(schema, 'x-encrypt');
  }
  return schema;
}

function APIInjection(api) {
  // Automatically add Authorization for all endpoints with security set
  _.forEach(api.paths, (pathBody) => {
    _.forEach(pathBody, (endpoint) => {
      if (_.isPlainObject(endpoint) && _.has(endpoint, 'security')) {
        const params = _.get(endpoint, 'parameters', []);
        _.set(endpoint, 'parameters', [
          { $ref: '#/parameters/Authorization' },
          ...params
        ]);
      }
    });
  });

  const camelCaseRequired = (schema) => {
    schema.required = _.map(schema.required, _.camelCase);
    return schema;
  }

  // Bind models jsonSchema to definitions
  _.forEach(models, (model, modelName) => {
    const flow = _.flow(_.cloneDeep, stripEncrypted, camelCaseKeys, camelCaseRequired);
    _.set(api, ['definitions', modelName], flow(model.getSchema));
    _.set(api, ['definitions', `Create${modelName}`], flow(model.createSchema));
    _.set(api, ['definitions', `Update${modelName}`], flow(model.updateSchema));
  });

  // Bind controllers to definitions
  _.forEach(controllers, (controller) => {
    if (controller.IGNORE) return;
    _.merge(api.paths, controller.constructor.SwaggerRoutes);
  });

  return api;
}

resolve(root, options)
  .then((results) => {
    const jsonSchema = APIInjection(results.resolved);
    const yaml = replaceVars(YAML.dump(jsonSchema));
    fs.writeFile(path.resolve(__dirname, '../api/swagger/swagger.yaml'), yaml, (err) => {
      if (err) {
        logger.error('swagger merged fail:', err);
        process.exit(1);
      } else {
        logger.verbose('swagger merged successfully.');
        process.exit(0);
      }
    });
  })
  .catch((err) => {
    logger.error('swagger merged fail:', err);
    process.exit(1);
  });
