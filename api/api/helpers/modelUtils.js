'use strict';

const _ = require('lodash');
const moment = require('moment');
const { ValidationError } = require('objection');
const { UUID } = require('./constants');
const { HttpError } = require('./utils');

/**
 * @param  {string} str string to validate as UUID
 * @return {Boolean}
 */
function validUuid(str) {
  const uuidv4 = new RegExp(UUID, 'i');
  return uuidv4.test(str);
}

/**
 * @typedef collection
 * @type {object|array|any}
 */

/**
 * iterate a collection recursively, invoking a function on each end level
 * @param  {collection} collection
 * @param  {function} [fn=_.noop]
 * @return {?collection}
 */
function iterateCollection(collection, fn = _.noop) {
  if (_.isArray(collection)) {
    return _.map(collection, o => iterateCollection(o, fn));
  } else if (_.isPlainObject(collection)) {
    return _.mapValues(_.cloneDeep(collection, value => iterateCollection(value, fn)))
    /*
     * const clone = _.cloneDeep(collection);
     * _.forEach(clone, (value, key) => {
     *   const res = iterateCollection(value, fn);
     *   clone[key] = res !== undefined ? res : value;
     * });
     * return clone;
     */
  }
  return fn(collection);
}

/**
 * @description a custom collection structure defined by {@link https://json-schema.org/specification.html}
 * @typedef jsonSchema
 * @type {collection}
 */

/**
 * @typedef ValidationFunction
 * @type {function}
 * @param {jsonSchema} schema
 * @param {?any}  [value]
 * @param {Boolean}  [isRequired = false]
 */

/**
 * Given a jsonSchema for an object, iterate the object and invoke a validation method
 *  for the schema subset, object value, and the schema's required
 * @param  {jsonSchema} jsonSchema
 * @param  {object} object
 * @param  {ValidationFunction} [fn=_.noop]
 * @return {?jsonSchema}
 */
function iterateSchema(jsonSchema, object, fn = _.noop) {
  const clone = _.cloneDeep(object);
  const iterate = _.get(jsonSchema, 'properties', _.get(jsonSchema, 'items', {}));
  const required = _.get(jsonSchema, 'required', []);
  _.each(iterate, (schema, prop) => {
    const value = clone[prop];
    const { type } = schema;
    if (type === 'object') {
      clone[prop] = iterateSchema(schema, clone[prop], fn);
    } else if (type === 'array') {
      clone[prop] = _.map(value, o => iterateSchema(schema, o, fn));
    } else {
      const isRequired = required.includes(prop);
      const res = fn(schema, value, isRequired);
      clone[prop] = res === undefined ? value : res;
    }
  });
  return clone;
}


/**
 * casts valid data-times to moments
 * @param  {jsonSchema} jsonSchema
 * @param  {any} [value]
 * @return {any}
 */
function castDateTimeToMoment(jsonSchema, object) {
  return iterateSchema(jsonSchema, object, (schema, value) => {
    const { type, format } = schema;
    if (type === 'string' && format === 'date-time' && value !== undefined) {
      return moment(value).isValid() ? moment(value) : value;
    }
    return value;
  });
}

/**
 * validates UUIDs for an object + schema
 * @param  {jsonSchema} jsonSchema
 * @param  {any} [object]
 * @throws {ValidationError}
 * @return {undefined}
 */
function validateUuids(jsonSchema, object) {
  iterateSchema(jsonSchema, object, (schema, value, isRequired) => {
    const { type, format } = schema;
    if (type === 'string' && format === 'uuid') {
      if (!isRequired && !_.isString(value)) {
        return;
      }
      const valid = module.exports.validUuid(value);
      if (!valid) {
        throw new ValidationError({
          statusCode: 400,
          type: 'ModelValidation',
          message: 'Invalid UUID',
          data: {
            [format]: [
            {
              message: `should match format "${format}"`,
              keyword: 'format',
              params: {
                format,
                value
              }
            }
          ]
          }
        });
      }
    }
  });
}

/**
 * Casts moments/dates to strings for API output
 * @param  {collection} collection
 * @return {collection}
 */
function datesToString(collection) {
  return iterateCollection(collection, (value) => {
    if (_.isDate(value)) {
      return moment(value).toISOString();
    } else if (value instanceof moment) {
      return value.toISOString();
    }
    return undefined;
  });
}

/**
 * @param  {QueryBuilder} query
 * @param  {string} sort
 * @return {QueryBuilder}
 */
function applySort(query, sort) {
  const isAscending = sort.charAt(0) === '+';
  const sortDir = isAscending ? 'ASC' : 'DESC';
  const column = _.snakeCase(sort.slice(1));
  return query.orderBy(column, sortDir);
}

const EQ_MAP = {
  'eq': '=',
  'lte': '<=',
  'gte': '>=',
  'gt': '>',
  'lt': '<',
  'not': '!='
};

function convertFilterStringToArgs(filterString) {
  const pattern = new RegExp(`(.*)\\[(${Object.keys(EQ_MAP).join('|')})\\]\\=(.*)`);
  if (!pattern.test(filterString)) {
    throw new HttpError(`Invalid filter pattern "${filterString}"`, 400);
  }
  const [,
    field,
    equality,
    value
  ] = filterString.match(pattern);
  return [field, EQ_MAP[equality], value];
}

module.exports = {
  validUuid,
  iterateSchema,
  iterateCollection,
  castDateTimeToMoment,
  validateUuids,
  datesToString,
  applySort,
  convertFilterStringToArgs
};
