'use strict';

const _ = require('lodash');
const { Model } = require('objection');
const { HttpError } = require('../helpers/utils');
const { castDateTimeToMoment, validateUuids, datesToString, convertFilterStringToArgs, applySort } = require('../helpers/modelUtils');

class BaseQueryBuilder extends Model.QueryBuilder {
  logQuery() {
    // eslint-disable-next-line no-console
    console.log(this.toString());
    return this;
  }

  asCallback(callback) {
    const singleOp = _.find(this._operations, { name: 'first' });
    super.asCallback((err, res) => {
      if (err) {
        callback(err);
      } else if (!res && singleOp) {
        const id = _.get(_.find(this._operations, { name: 'where' }), 'args.[0].id');
        callback(new HttpError(`${this.modelName} with id ${id} could not be found`, 404));
      } else {
        callback(err, res);
      }
    });
  }

  sort(sort = []) {
    return sort.reduce(
      (builder, sortStr) => applySort(builder, sortStr),
      this
    );
  }

  filters(filters = []) {
    console.log(filters);
    return filters.reduce(
      (builder, filterString) => {
        const args = convertFilterStringToArgs(filterString);
        return builder.where(...args);
      },
      this
    );
  }
}

class BaseModel extends Model {
  static get useLimitInFirst() {
    return true;
  }

  static get QueryBuilder() {
    return BaseQueryBuilder;
  }

  // Prevent stringifying JSONB objects
  static get jsonAttributes() {
    return [];
  }

  static get modelPaths() {
    return [__dirname];
  }

  static query() {
    const builderInstance = super.query();
    builderInstance.tableName = this.tableName;
    builderInstance.modelName = this.name;
    return builderInstance;
  }

  $formatJson(json) {
    // Remember to call the super class's implementation.
    json = super.$formatJson(json);
    json = datesToString(json);
    return json;
  }

  // eslint-disable-next-line class-methods-use-this
  $beforeValidate(jsonSchema, json) {
    const parsed = datesToString(json);
    return super.$beforeValidate(jsonSchema, parsed);
  }

  $afterValidate(json) {
    super.$afterValidate(json);
    const jsonSchema = _.get(this, 'constructor.jsonSchema', {});
    validateUuids(jsonSchema, json);
  }

  $parseDatabaseJson(json) {
    let parsedJson = super.$parseDatabaseJson(json);
    const jsonSchema = _.get(this, 'constructor.jsonSchema', {});
    parsedJson = castDateTimeToMoment(jsonSchema, parsedJson);
    return parsedJson;
  }
}

module.exports = BaseModel;
