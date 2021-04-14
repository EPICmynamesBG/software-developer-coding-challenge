'use strict';

const _ = require('lodash');
const assert = require('assert');
const sinon = require('sinon');

const NhtsaController = require('../../../api/controllers/NhtsaController');
const utils = require('../../../api/helpers/utils');
const BaseController = require('../../../api/controllers/BaseController');
const NHTSA = require('../../../api/services/nhtsa');
const decodeResponse = require('../../data/NHTSA_decodeVinExtended.json');

describe('NhtsaController', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('nhtsaVinLookup', () => {
    const sampleVin = _.times(17, () => 0).join('');
    const sampleReq = {
      swagger: {
        params: {
          vin: {
            schema: {
              in: 'path'
            },
            value: sampleVin
          }
        }
      }
    };

    const mockRes = { res: true };

    beforeEach(() => {
      sandbox.stub(NHTSA, 'decodeVinExtended').resolves(decodeResponse);
      sandbox.stub(utils, 'handleResponse');
      sandbox.spy(BaseController.Helper, 'getPathParams');
      sandbox.spy(NHTSA, 'formatVinDecode');
    });

    it('should use the path vin to request extended vin info', async () => {
      await NhtsaController.nhtsaVinLookup(sampleReq, mockRes);
      
      sinon.assert.calledWith(NHTSA.decodeVinExtended, sampleVin);
      sinon.assert.calledWith(NHTSA.formatVinDecode, decodeResponse.data);

      const formatted = NHTSA.formatVinDecode.firstCall.returnValue;
      sinon.assert.calledWith(utils.handleResponse, undefined, {
        results: formatted,
        raw: decodeResponse.data
      }, mockRes);
    });

    it('should handle vin lookup errors as they occur', async () => {
      const err = new Error('oops');
      NHTSA.decodeVinExtended.rejects(err);

      await NhtsaController.nhtsaVinLookup(sampleReq, mockRes);
      
      sinon.assert.calledWith(NHTSA.decodeVinExtended, sampleVin);
      sinon.assert.notCalled(NHTSA.formatVinDecode);

      sinon.assert.calledWith(utils.handleResponse, err, undefined, mockRes);
    });
  }); 
});
