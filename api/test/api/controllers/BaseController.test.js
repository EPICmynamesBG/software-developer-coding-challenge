'use strict';

const assert = require('assert');
const sinon = require('sinon');

const BaseController = require('../../../api/controllers/BaseController');
const { ROLES } = require('../../../api/helpers/constants');
const utils = require('../../../api/helpers/utils');

describe('BaseController', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('Helper', () => {
    const input = {
      swagger: {
        params: {
          userId: {
            schema: {
              in: 'path'
            },
            value: '001'
          },
          sortDirection: {
            schema: {
              in: 'query'
            },
            value: 'asc'
          }
        }
      }
    };

    describe('getPathParams', () => {
      it('should extract swagger path params and return a snake case object version', () => {
        sandbox.spy(utils, 'snakeCaseKeys');
        const output = BaseController.Helper.getPathParams(input);
        assert.deepStrictEqual(output, {
          user_id: '001'
        });

        sinon.assert.calledOnce(utils.snakeCaseKeys);
        sinon.assert.calledWithExactly(utils.snakeCaseKeys, {
          userId: '001'
        });
      });

      it('should ignore fields listing in omit list', () => {
        sandbox.spy(utils, 'snakeCaseKeys');
        const output = BaseController.Helper.getPathParams(input, ['userId']);
        assert.deepStrictEqual(output, {});

        sinon.assert.calledOnce(utils.snakeCaseKeys);
        sinon.assert.calledWithExactly(utils.snakeCaseKeys, {});
      });
    });
  });

  describe('static', () => {
    describe('Security (property)', () => {
      it('should have default route security', () => {
        assert.deepStrictEqual(BaseController.Security, {
          '/': {
            get: [ROLES.STANDARD],
            post: [ROLES.STANDARD]
          },
          '//{id}': {
            get: [ROLES.STANDARD],
            put: [ROLES.STANDARD],
            delete: [ROLES.STANDARD]    
          }
        })
      });
    });

    describe('Name (property)', () => {
      it('should generate from the class name');
    });

    describe('SwaggerRoutes (property)', () => {
      it('should return a generated CRUD route schema from the controller properties');
    });
  });

  describe('instance', () => {
    describe('responder', () => {
      it('should invoke the async method and handleResponse accordingly');
    });

    describe('getAllByPathIds', () => {
      it('should use Helper.getPathParams to get path filter ids');

      it('should invoke Helper.getPathParams to get query options');

      it('should call the response and use the service findOne method');
    });
  });
});
