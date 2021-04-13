'use strict';

const _ = require('lodash');
const assert = require('assert');
const sinon = require('sinon');

const NhtsaController = require('../../../api/controllers/NhtsaController');
const { ROLES } = require('../../../api/helpers/constants');
const utils = require('../../../api/helpers/utils');

describe('NhtsaController', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('nhtsaVinLookup', () => {
    const sampleReq = {
      swagger: {
        params: {
          vin: {
            schema: {
              in: 'path'
            },
            value: _.times(17, () => 0).join('')
          }
        }
      }
    };

    beforeEach(() => {
      sandbox.stub(utils, 'handleResponse');
    });

    it('should use the path vin to request extended vin info', async () => {

    });

    it('should reformat the response');

    it('should handle vin lookup errors as they occur');
  }); 
});
