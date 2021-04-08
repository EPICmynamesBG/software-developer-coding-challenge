'use strict';

const FileService = require('../services/FileService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');

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

  static get FormFields() {
    return [
      {
        name: 'upfile',
        type: 'file',
        description: 'file to upload',
        required: true
      },
      {
        name: 'file_name',
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
    return routes;
  }

  async createWithPathIds(req, res) {
    const pathIds = this.constructor.Helper.getPathParams(req);
    const createObj = { ...req.body, ...pathIds };
    const file = req.files.upfile[0];
    return this.responder('create', res, this.service.create(file, createObj));
  }
}

module.exports = FileController;
