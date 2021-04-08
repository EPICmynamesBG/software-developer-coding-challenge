'use strict';

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

  constructor(modelClass) {
    this.modelClass = modelClass;
  }

  create(collection) {
    return this.modelClass.query()
      .insert(collection)
      .returning('*');
  }

  getAll(pagination) {
    const query = this.modelClass.query()
      .select('*');
    return this.constructor.applySort(
      this.constructor.applyPagination(
        query,
        pagination
      ),
      pagination
    );
  }

  find(params, pagination) {
    const query = this.modelClass.query()
      .select('*')
      .where(params);

    return this.constructor.applySort(
      this.constructor.applyPagination(
        query,
        pagination
      ),
      pagination
    );
  }

  getById(id) {
    return this.modelClass.query()
      .findOne({ id });
  }

  findOne(params) {
    return this.modelClass.query()
      .select('*')
      .first()
      .where(params);
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
