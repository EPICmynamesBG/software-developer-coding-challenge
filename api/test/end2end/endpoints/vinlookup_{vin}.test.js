'use strict';

const _ = require('lodash');
const assert = require('assert');
const request = require('supertest');
const sinon = require('sinon');
const NHTSA = require('../../../api/services/nhtsa');
const decodeVinExtendedResponse = require('../../data/NHTSA_decodeVinExtended.json');
const useTestServer = require('../useTestServer');

const sampleValidVin = '2G61R5S36D9155536';

describe('/vinlookups/{vin}', function () {
  const sandbox = sinon.createSandbox();
  let getServer = useTestServer(this);
  const sampleValidVin = '2G61R5S36D9155536';

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET', () => {
    beforeEach(() => {
      sandbox.stub(NHTSA, 'decodeVinExtended')
        .resolves(decodeVinExtendedResponse);
    });

    context('security', () => {
      it('should not require authentication', async () => {
        await request(getServer())
          .get(`/vinlookup/${sampleValidVin}`)
          .set('Accept', 'application/json')
          .expect(200);
      });
    });

    context('200', () => {
      it('should perform a successfull request', async () => {
        const { body } = await request(getServer())
          .get(`/vinlookup/${sampleValidVin}`)
          .set('Accept', 'application/json')
          .expect(200);
        
          assert(Object(body).hasOwnProperty('results'), 'should have result property');
          assert(Object(body).hasOwnProperty('raw'), 'should have result property');
  
          assert.strictEqual(typeof body.results, 'object');
          assert.strictEqual(typeof body.raw, 'object');
        });
    });

    context('400', () => {
      it('should error when given an invalid VIN', async () => {
        const { body } = await request(getServer())
          .get('/vinlookup/invalid')
          .set('Accept', 'application/json')
          .expect(400);
        assert(Object(body).hasOwnProperty('message'), 'should have message property');
        assert(Object(body).hasOwnProperty('statusCode'), 'should have statusCode property');

        assert.strictEqual(typeof body.message, 'string');
        assert.strictEqual(body.statusCode, 400);
      });
    });

    context('500', () => {
      it('should error if the NHTSA service lookup fails', async () => {
        NHTSA.decodeVinExtended.rejects(new Error('oops'));
        const { body } = await request(getServer())
          .get(`/vinlookup/${sampleValidVin}`)
          .set('Accept', 'application/json')
          .expect(500);
        
        assert(Object(body).hasOwnProperty('message'), 'should have message property');
        assert(Object(body).hasOwnProperty('statusCode'), 'should have statusCode property');

        assert.strictEqual(body.message, 'Internal error');
        assert.strictEqual(body.statusCode, 500);
      });
    });
  });
});
