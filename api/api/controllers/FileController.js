'use strict';

const _ = require('lodash');
const FileService = require('../services/FileService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');
const { snakeCaseKeys, handleResponse } = require('../helpers/utils');

class FileController extends BaseController {
  constructor(idFields = []) {
    super(new FileService(idFields));
  }

  static get Name() {
    return 'File';
  }

  static get Security() {
    return {
      [this.BaseRoute]: {
        get: [],
        post: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}`]: {
        get: [],
        put: [ROLES.STANDARD],
        delete: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}/render`]: {
        get: []
      }
    };
  }

  static get FormFields() {
    return [
      {
        name: 'upfile',
        type: 'file',
        description: 'file to upload',
        required: true
      },
      {
        name: 'fileName',
        type: 'string',
        description: 'custom file name',
        required: false
      }
    ];
  }

  static get SwaggerRoutes() {
    const routes = { ...super.SwaggerRoutes };

    routes[this.BaseRoute].post.consumes = ['multipart/form-data'];
    let postRouteParams = routes[this.BaseRoute].post.parameters;
    postRouteParams = postRouteParams.filter(field => (field.in !== 'body'));
    postRouteParams.push(...this.FormFields.map(field => ({ ...field, in: 'formData' })));
    routes[this.BaseRoute].post.parameters = postRouteParams;
    
    // Additional route generation
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

    routes[`${this.BaseRoute}/{id}/render`] = {
      'x-swagger-router-controller': this.name,
      get: {
        summary: 'Render file',
        operationId: 'renderFile',
        tags: [this.Name],
        produces: ['image/*'],
        parameters: [
          ...pathParams,
          { $ref: '#/parameters/id' }
        ],
        responses: {
          200: {
            description: 'Success',
            schema: {
              type: 'file'
            }
          },
          ..._.cloneDeep(errorResponses)
        }
      }
    };
    return routes;
  }

  async createWithPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req);
    const createObj = { ...req.body, ...pathIds };
    const file = req.files.upfile[0];
    return this.responder('create', res, () => this.service.create(file, snakeCaseKeys(createObj)));
  }

  async renderFile(req, res) {
    try {
      const pathIds = this.constructor.Helper.getPathParams(req, this.constructor.omitPathVars);
      const queryParams = this.constructor.Helper.getQueryParams(req);
      const file = await this.service.findOne(pathIds, queryParams)
      console.log(file);
      const fileStream = this.service.openReadStream(file);
      res.setHeader('Content-Type', file.file_type);
      res.setHeader('Content-Length', file.file_size);
      return fileStream.pipe(res);
    } catch (e) {
      handleResponse(e, undefined, res);
    }
  }
}

module.exports = FileController;
