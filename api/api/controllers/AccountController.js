'use strict';

const _ = require('lodash');
const Account = require('../models/Account');
const AccountService = require('../services/AccountService');
const { HttpError, handleResponse } = require('../helpers/utils');
const authService = require('../services/authService');
const BaseController = require('./BaseController');
const { ROLES } = require('../helpers/constants');

class AccountController extends BaseController {
  constructor() {
    super(AccountService);
  }

  static get BaseRoute() {
    return '/accounts';
  }

  static get Security() {
    return {
      [this.BaseRoute]: {
        get: [ROLES.ADMIN],
        post: []
      },
      [`${this.BaseRoute}/me`]: {
        get: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/login`]: {
        post: []
      },
      [`${this.BaseRoute}/refresh`]: {
        get: [ROLES.STANDARD]
      },
      [`${this.BaseRoute}/{id}`]: {
        get: [ROLES.STANDARD, ROLES.ADMIN],
        put: [ROLES.STANDARD, ROLES.ADMIN],
        delete: [ROLES.STANDARD, ROLES.ADMIN]
      }
    };
  }

  static get SwaggerRoutes() {
    const routes = super.SwaggerRoutes;
    _.unset(routes, [this.BaseRoute, 'post']);
    return routes;
  }

  // eslint-disable-next-line class-methods-use-this
  async login(req, res) {
    const body = _.get(req, 'swagger.params.body.value', {});
    const { email, password } = body;

    try {
      const account = await Account.login(email, password);
      if (!account) {
        throw new HttpError('Invalid/Missing Credentials', 400);
      }
      const token = authService.generateToken(account);
      handleResponse(null, { token }, res);
    } catch (e) {
      handleResponse(e, null, res);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  me(req, res) {
    handleResponse(null, req.account, res);
  }

  // eslint-disable-next-line class-methods-use-this
  refreshToken(req, res) {
    const token = authService.refreshToken(req.token);
    if (_.isError(token)) {
      handleResponse(token, null, res);
    } else handleResponse(null, { token }, res);
  }

  async create(req, res) {
    const body = _.get(req, 'swagger.params.body.value', {});
    const { email, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      handleResponse(new HttpError('Bad Request: Passwords inequal', 400), null, res);
      return;
    }

    return this.responder('create', res, () => this.service.create({ email, password }));
  }
}

const instance = new AccountController();

module.exports = {
  constructor: AccountController,
  create: instance.create.bind(instance),
  getAll: instance.getAll.bind(instance),
  getById: instance.getById.bind(instance),
  me: instance.me.bind(instance),
  login: instance.login.bind(instance),
  refresh: instance.refreshToken.bind(instance),
  updateById: instance.updateById.bind(instance),
  deleteById: instance.deleteById.bind(instance)
};
