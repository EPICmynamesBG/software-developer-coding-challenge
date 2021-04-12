'use strict';

const _ = require('lodash');
const { ROLES } = require('../helpers/constants');
const { handleResponse, snakeCaseKeys } = require('../helpers/utils');

const Helper = {
  getPathParams: (req, omitPathVars = []) => {
    const params = _.get(req, 'swagger.params', {});
    const returnObj = {};
    _.forEach(params, (obj, field) => {
      if (obj.schema.in === 'path') {
        _.set(returnObj, field, obj.value);
      }
    });
    return snakeCaseKeys(
      _.omitBy(returnObj, (val, key) => omitPathVars.includes(key))
    );
  },
  getQueryParams: (req, omitQueryVars = []) => {
    const params = _.get(req, 'swagger.params', {});
    const returnObj = {};
    _.forEach(params, (obj, field) => {
      if (obj.schema.in === 'query') {
        _.set(returnObj, field, obj.value);
      }
    });
    return snakeCaseKeys(
      _.omitBy(returnObj, (val, key) => omitQueryVars.includes(key))
    );
  }
};

class BaseController {
  constructor(service) {
    this.service = service;
    this.objectName = _.toLower(this.service.modelClass.name);
  }

  static get Helper() {
    return Helper;
  }

  /**
   * Omit path vars from identity queries
   * @type {string[]}
   */
  static get omitPathVars() {
    return [];
  }

  static get paginationParams() {
    return ['sort', 'limit', 'page'];
  }

  async responder(action, response, asyncFn) {
    try {
      const results = await asyncFn();
      switch (_.toLower(action)) {
      case 'create':
      case 'update':
      case 'delete':
        handleResponse(undefined, {
          action: _.toUpper(action),
          [this.objectName]: results
        }, response);
        break;
      default:
        // select
        handleResponse(undefined, results, response);
      }
    } catch (e) {
      handleResponse(e, undefined, response);
    }
    return;
  }

  create(req, res) {
    return this.responder('create', res, () =>  this.service.create(snakeCaseKeys(req.body)))
  }

  createWithPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req, this.constructor.omitPathVars);
    const createObj = { ...snakeCaseKeys(req.body), ...pathIds };
    return this.responder('create', res, () => this.service.create(createObj));
  }

  getAll(req, res) {
    const queryParams = this.constructor.Helper.getQueryParams(req);
    const paginationParams = _.pick(queryParams, this.constructor.paginationParams);
    const otherParams = _.omit(queryParams, this.constructor.paginationParams);
    return this.responder('select', res, () => this.service.getAll(paginationParams, otherParams));
  }

  getAllByPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req, this.constructor.omitPathVars);
    const queryParams = this.constructor.Helper.getQueryParams(req);
    const paginationParams = _.pick(queryParams, this.constructor.paginationParams);
    const otherParams = _.omit(queryParams, this.constructor.paginationParams);
    return this.responder('select', res, () => this.service.find(pathIds, paginationParams, otherParams));
  }

  getById(req, res) {
    const id = _.get(req, 'swagger.params.id.value');
    const queryParams = this.constructor.Helper.getQueryParams(req);
    return this.responder('select', res, () => this.service.getById(id, queryParams));
  }

  getByPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req, this.constructor.omitPathVars);
    const queryParams = this.constructor.Helper.getQueryParams(req);
    return this.responder('select', res, () => this.service.findOne(pathIds, queryParams));
  }

  updateById(req, res) {
    const currentId = _.get(req, 'swagger.params.id.value');
    // intentionally prevent updating id
    const body = _.omit(snakeCaseKeys(req.body), ['id']);
    return this.responder('update', res, () => this.service.updateById(currentId, body));
  }

  updateByPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req, this.constructor.omitPathVars);
    // intentionally prevent updating id
    const body = _.omit(snakeCaseKeys(req.body), ['id']);
    return this.responder('update', res, () => this.service.update(pathIds, body));
  }

  deleteById(req, res) {
    const id = _.get(req, 'swagger.params.id.value');
    return this.responder('delete', res, () => this.service.deleteById(id));
  }

  deleteByPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req, this.constructor.omitPathVars);
    return this.responder('delete', res, () => this.service.delete(pathIds));
  }

  static get BaseRoute() {
    return '/';
  }

  /**
   * the Model object type that this entity references/wraps
   * @type {String}
   */
  static get Name() {
    return _.get(_.startCase(this.name).split(' '), '[0]', 'Unknown');
  }

  static get Security() {
    return {
      [this.BaseRoute]: {
        get: [ROLES.STANDARD],
        post: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}`]: {
        get: [ROLES.STANDARD],
        put: [ROLES.STANDARD],
        delete: [ROLES.STANDARD]
      }
    };
  }

  static get _RouteConsumes() {
    return ['application/json'];
  }

  static get supportsUpdate() { return true; }
  static get supportsDelete() { return true; }

  /**
   * @summary Generated Swagger endpoints
   * @description Generates Swagger endpoints with expected params and security
   * @type {object}
   */
  static get SwaggerRoutes() { // eslint-disable-line max-lines-per-function
    const regx = /\{{1,}?(.+?)\}{1,}?/g;
    const errorResponses = {
      204: { $ref: '#/responses/Empty' },
      400: { $ref: '#/responses/BadRequest' },
      403: { $ref: '#/responses/UnauthorizedError' },
      default: { $ref: '#/responses/Error' }
    };
    let match = regx.exec(this.BaseRoute);
    const pathParams = [];
    while (match !== null) {
      const name = match[1];
      pathParams.push({
        $ref: `#/parameters/${name}`
      });
      match = regx.exec(this.BaseRoute);
    }

    const queryParams = [{
      $ref: '#/parameters/page'
    }, {
      $ref: '#/parameters/pageSize'
    }, {
      $ref: '#/parameters/sort'
    }, {
      $ref: '#/parameters/filters'
    }, {
      $ref: '#/parameters/include'
    }];

    const routes = {
      [this.BaseRoute]: {
        'x-swagger-router-controller': this.name,
        get: {
          summary: 'Get All',
          operationId: 'getAll',
          tags: [this.Name],
          parameters: [...pathParams, ...queryParams],
          consumes: this._RouteConsumes,
          responses: {
            200: {
              description: 'Success',
              schema: {
                type: 'array',
                items: { $ref: `#/definitions/${this.Name}` }
              }
            },
            ..._.cloneDeep(errorResponses)
          }
        },
        post: {
          summary: 'Create',
          operationId: 'create',
          tags: [this.Name],
          consumes: this._RouteConsumes,
          parameters: [
            ...pathParams,
            {
              name: 'body',
              in: 'body',
              required: true,
              schema: { $ref: `#/definitions/Create${this.Name}` }
            }
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                type: 'object',
                properties: {
                  action: {
                    $ref: '#/definitions/action',
                    default: 'CREATE'
                  },
                  [_.camelCase(this.Name)]: { $ref: `#/definitions/${this.Name}` }
                }
              }
            },
            ..._.cloneDeep(errorResponses)
          }
        }
      },
      [`${this.BaseRoute}/{id}`]: {
        'x-swagger-router-controller': this.name,
        get: {
          summary: 'Get By Id',
          operationId: 'getById',
          tags: [this.Name],
          consumes: this._RouteConsumes,
          parameters: [
            ...pathParams,
            { $ref: '#/parameters/id' },
            {
              $ref: '#/parameters/include'
            }
          ],
          responses: {
            200: {
              description: 'Success',
              schema: { $ref: `#/definitions/${this.Name}` }
            },
            ..._.cloneDeep(errorResponses)
          }
        },
        put: {
          summary: 'Update By Id',
          operationId: 'updateById',
          tags: [this.Name],
          consumes: this._RouteConsumes,
          parameters: [
            ...pathParams,
            { $ref: '#/parameters/id' },
            {
              name: 'body',
              in: 'body',
              required: true,
              schema: { $ref: `#/definitions/Update${this.Name}` }
            }
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                type: 'object',
                properties: {
                  action: {
                    $ref: '#/definitions/action',
                    default: 'UPDATE'
                  },
                  [_.camelCase(this.Name)]: { $ref: `#/definitions/${this.Name}` }
                }
              }
            },
            ..._.cloneDeep(errorResponses)
          }
        },
        delete: {
          summary: 'Delete By Id',
          operationId: 'deleteById',
          tags: [this.Name],
          consumes: this._RouteConsumes,
          parameters: [
            ...pathParams,
            { $ref: '#/parameters/id' }
          ],
          responses: {
            200: {
              description: 'Success',
              schema: {
                type: 'object',
                properties: {
                  action: {
                    $ref: '#/definitions/action',
                    default: 'DELETE'
                  },
                  [_.camelCase(this.Name)]: { $ref: `#/definitions/${this.Name}` }
                }
              }
            },
            ..._.cloneDeep(errorResponses)
          }
        }
      }
    };

    if (!this.supportsUpdate) {
      _.unset(routes, [`${this.BaseRoute}/{id}`, 'put']);
    }
    if (!this.supportsDelete) {
      _.unset(routes, [`${this.BaseRoute}/{id}`, 'delete']);
    }

    _.forEach(routes, (def, route) => {
      _.forEach(def, (endpointDef, reqMethod) => {
        const roles = this.Security[route][reqMethod];
        if (!_.isEmpty(roles)) {
          _.set(endpointDef, 'security', [{ BearerAuth: [] }]);
          _.set(endpointDef, 'x-trdrev-api-security-roles', roles);
        }
      });
    });
    return routes;
  }
}

module.exports = BaseController;
