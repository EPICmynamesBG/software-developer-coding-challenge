'use strict';

const _ = require('lodash');
const logger = require('../helpers/logger');

/**
 * @typedef {Pagination}
 * @type {object}
 * @property {number} page
 * @property {number} page_size
 * @property {string} sort
 */

class BaseService {
  /**
   * @param {objection.QueryBuilder} query
   * @param {Pagination} [pagination]
   * @returns {objection.QueryBuilder}
   */
  static applyPagination(query, pagination) {
    if (!pagination) {
      return query;
    }
    const { page_size: pageSize = 50, page = 0 } = pagination;
    return query
      .limit(pageSize)
      .offset(pageSize * page);
  }

  /**
   * @param {objection.Query} query
   * @param {Pagination} [pagination]
   * @returns {objection.Query}
   */
  static applySort(query, pagination) {
    if (!pagination) {
      return query;
    }
    return query
      .sort(pagination.sort);
  }

  /**
   * @param {objection.QueryBuilder} query
   * @param {string[]} [filters]
   * @returns {objection.QueryBuilder}
   */
  static applyFilters(query, filters) {
    if (!filters) {
      return query;
    }
    return query
      .filters(filters);
  }

  /**
   * @param {objection.QueryBuilder} query
   * @param {string[]} [includes = []]
   * @returns {objection.QueryBuilder}
   */
  static applyInclusion(query, includes = []) {
    if (!includes) {
      return query;
    }
    return includes.reduce((qry, inclusion) => qry.withGraphFetched(inclusion), query);
  }

  /**
   *
   * @param {objection.QueryBuilder} query
   * @param {Pagination} [pagination]
   * @param {object} [additionalParams = {}]
   * @param {string[]} [additionalParams.filters]
   * @param {string[]} [additionalParams.include = []]
   * @returns
   */
  static applyQueryFlow(query, pagination, additionalParams = {}) {
    const applyMethods = _.flow(
      (qry) => this.applyFilters(qry, additionalParams.filters),
      (qry) => this.applyInclusion(qry, additionalParams.include),
      (qry) => this.applySort(qry, pagination),
      (qry) => this.applyPagination(qry, pagination)
    );
    return applyMethods(query);
  }

  /**
   *
   * @param {function<objection.BaseModel>} modelClass objection BaseModel class or subclass
   */
  constructor(modelClass) {
    this.modelClass = modelClass;
  }

  create(collection) {
    return this.modelClass.query()
      .insert(collection)
      .returning('*');
  }

  async countAll(params = undefined, additionalParams = {}) {
    let query = this.modelClass.query()
      .count('*')
      .skipUndefined()
      .where(params)
      .first();
    query = _.flow(
      (qry) => this.constructor.applyFilters(qry, additionalParams.filters),
      (qry) => this.constructor.applyInclusion(qry, additionalParams.include),
    )(query);
    const { count = '0' } = await query;
    try {
      return Number.parseInt(count, 10);
    } catch (e) {
      logger.warn('Failed to parseInt for countAll operation', { count });
      return count;
    }
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
