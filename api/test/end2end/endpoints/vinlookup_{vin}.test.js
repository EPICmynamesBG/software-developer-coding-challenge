'use strict';

const sinon = require('sinon');
const NHTSA = require('../../../api/services/nhtsa');
const decodeVinExtendedResponse = require('../../data/NHTSA_decodeVinExtended.json');

describe('/vinlookups/{vin}', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET', () => {
    beforeEach(() => {
      sandbox.stub(NHTSA, 'decodeVinExtended')
        .resolves(decodeVinExtendedResponse);
    });

    context('security', () => {
      it('should not require authentication');
    });

    context('200', () => {
      it('should perform a successfull request');
    });

    context('400', () => {
      it('should error when given an invalid VIN');
    });

    context('500', () => {
      it('should error if the NHTSA service lookup fails');
    });
  });
});
