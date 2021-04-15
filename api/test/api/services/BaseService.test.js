'use strict';

const assert = require('assert');
const sinon = require('sinon');

const BaseService = require('../../../api/services/BaseService');

// random model chosen for testing purposes
const Account = require('../../../api/models/Account');

describe('BaseService', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('static', () => {
    describe('applyPagination', () => {
      const buildMockQueryBuilder = () => {
        const mockQueryBuilder = {};
        mockQueryBuilder.limit = sandbox.stub().returns(mockQueryBuilder);
        mockQueryBuilder.offset = sandbox.stub().returns(mockQueryBuilder);

        return mockQueryBuilder;
      };

      it('should do nothing when pagination is not provided', () => {
        const mockQueryBuilder = buildMockQueryBuilder();

        const output = BaseService.applyPagination(mockQueryBuilder);

        assert.strictEqual(output, mockQueryBuilder, 'output should be the provided input query builder');
        sinon.assert.notCalled(mockQueryBuilder.limit);
        sinon.assert.notCalled(mockQueryBuilder.offset);
      });

      it('should specify query limit and offset defaults when empty object provided', () => {
        const mockQueryBuilder = {};
        mockQueryBuilder.limit = sandbox.stub().returns(mockQueryBuilder);
        mockQueryBuilder.offset = sandbox.stub().returns(mockQueryBuilder);

        const output = BaseService.applyPagination(mockQueryBuilder, {});

        assert.strictEqual(output, mockQueryBuilder, 'output should be the provided input query builder');
        sinon.assert.calledWith(mockQueryBuilder.limit, 50);
        sinon.assert.calledWith(mockQueryBuilder.offset, 0);
      });

      it('should specify query limit and offset when values provided', () => {
        const mockQueryBuilder = {};
        mockQueryBuilder.limit = sandbox.stub().returns(mockQueryBuilder);
        mockQueryBuilder.offset = sandbox.stub().returns(mockQueryBuilder);

        const output = BaseService.applyPagination(mockQueryBuilder, {
          page: 2,
          page_size: 20
        });

        assert.strictEqual(output, mockQueryBuilder, 'output should be the provided input query builder');
        sinon.assert.calledWith(mockQueryBuilder.limit, 20);
        sinon.assert.calledWith(mockQueryBuilder.offset, 40);
      });
    });

    describe('applySort', () => {
      it('should do nothing when pagination is not provided');

      it('should invoke query.sort when sort is provided');
    });

    describe('applyFilters', () => {
      it('should do nothing when filters are not provided');

      it('should invoke query.filters when filters are provided');
    });

    describe('applyInclusion', () => {
      it('should do nothing when inclusions are not provided');

      it('should reduce and invoke withGraphFetched with provided inclusions');
    });

    describe('applyQueryFlow', () => {
      beforeEach(() => {
        const returnInput = (input) => input;
        sandbox.stub(BaseService, 'applyFilters').callsFake(returnInput);
        sandbox.stub(BaseService, 'applyInclusion').callsFake(returnInput);
        sandbox.stub(BaseService, 'applySort').callsFake(returnInput);
        sandbox.stub(BaseService, 'applyPagination').callsFake(returnInput);
      });

      it('should apply methods in sequence', () => {
        const mockQueryBuilder = {};
        const pagination = {
          page: 1,
          pageSize: 20
        };
        const additional = {
          filters: [],
          include: []
        };

        const output = BaseService.applyQueryFlow(mockQueryBuilder, pagination, additional);
        sinon.assert.callOrder(
          BaseService.applyFilters,
          BaseService.applyInclusion,
          BaseService.applySort,
          BaseService.applyPagination
        );
        assert.strictEqual(output, mockQueryBuilder);
      });
    });
  });

  describe('instance', () => {
    describe('constructor', () => {
      it('should instantiate with properties', () => {
        const instance = new BaseService(Account);
        assert.strictEqual(instance.modelClass, Account);
      });
    });

    describe('create', () => {
      it('should build and return an insert query');
    });

    describe('countAll', () => {
      it('should build a select count query and applyFilters + applyInclusion');
    });

    describe('getAll', () => {
      it('should build a select query and applyQueryFlow');
    });

    describe('find', () => {
      it('should build a filtered select query and applyQueryFlow');
    });

    describe('getById', () => {
      it('should build a select query to return a single record and applyInclusion');
    });

    describe('findOne', () => {
      it('should build a filtered select query to return a single record and applyInclusion');
    });

    describe('update', () => {
      it(`should build an update query with the specified
       update and filter criteria that returns the modified records`);
    });

    describe('updateById', () => {
      it('should build an update query with the specified update for a single object that returns the modified record');
    });

    describe('delete', () => {
      it('should build a delete query with the specified filter criteria that returns the deleted records');
    });

    describe('deleteById', () => {
      it('should build a delete query with the specified filter for a single object that returns the deleted record');
    });
  });
});
