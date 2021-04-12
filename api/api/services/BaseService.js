'use strict';

const _ = require('lodash');

/**
 * @typedef {Pagination}
 * @type {object}
 * @property {number} page
 * @property {number} pageSize
 */

class BaseService {
  static applyPagination(query, pagination) {
    if (!pagination) {
      return query;
    }
    const { pageSize = 50, page = 0 } = pagination;
    return query
      .limit(pageSize)
      .offset(pageSize * page);
  }

  static applySort(query, pagination) {
    if (!pagination) {
      return query;
    }
    return query
      .sort(pagination.sort);
  }


  static applyFilters(query, filters) {
    if (!filters) {
      return query;
    }
    return query
      .filters(filters);
  }

  static applyInclusion(query, includes = []) {
    if (!includes) {
      return query;
    }
    return includes.reduce((qry, inclusion) => query.withGraphFetched(inclusion), query);
  }

  static applyQueryFlow(query, pagination, additionalParams = {}) {
    const applyMethods = _.flow(
      qry => this.applyFilters(qry, additionalParams.filters),
      qry => this.applyInclusion(qry, additionalParams.include),
      qry => this.applySort(qry, pagination),
      qry => this.applyPagination(qry, pagination)
    );
    return applyMethods(query);
  }

  constructor(modelClass) {
    this.modelClass = modelClass;
  }

  create(collection) {
    return this.modelClass.query()
      .insert(collection)
      .returning('*');
  }

  getAll(pagination, additionalParams = {}) {
    const query = this.modelClass.query()
      .select('*');
    return this.constructor.applyQueryFlow(query, pagination, additionalParams);
  }

  find(params, pagination, additionalParams = {}) {
    const query = this.modelClass.query()
      .select('*')
      .where(params);

    return this.constructor.applyQueryFlow(query, pagination, additionalParams);
  }

  getById(id, additionalParams = {}) {
    return this.constructor.applyInclusion(
      this.modelClass.query()
        .findOne({ id }),
      additionalParams.include
    );
  }

  findOne(params, additionalParams = {}) {
    return this.constructor.applyInclusion(
      this.modelClass.query()
        .select('*')
        .first()
        .where(params),
      additionalParams.include
    );
  }

  update(params, updateObject) {
    return this.modelClass.query()
      .update(updateObject)
      .where(params)
      .returning('*');
  }

  updateById(id, updateObject) {
    return this.modelClass.query()
      .update(updateObject)
      .where({ id })
      .returning('*');
  }

  delete(params) {
    return this.modelClass.query()
      .delete(params)
      .returning('*');
  }

  deleteById(id) {
    return this.modelClass.query()
      .deleteById({ id })
      .returning('*');
  }
}

module.exports = BaseService;
