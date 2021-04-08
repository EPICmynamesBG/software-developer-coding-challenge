'use strict';

const _ = require('lodash');
const BaseModel = require('./BaseModel.js');
const { UUID } = require('../helpers/constants');

class CustomField extends BaseModel {
  static get tableName() {
    return 'custom_fields';
  }

  static get modifiers() {
    return {
      selectEssentials(builder) {
        builder.select('label', 'type', 'description', 'value');
      }
    };
  }


  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['label', 'type'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          pattern: UUID,
          example: '00000000-0000-0000-0000-000000000000'
        },
        label: {
          type: 'string',
          description: 'a label and unique key'
        },
        value: {
          type: ['string', 'null']
        },
        type: {
          type: 'string',
          enum: ['string', 'number', 'boolean']
        },
        description: {
          type: ['string', 'null']
        },
        owner_id: {
          type: ['string', 'null'],
          pattern: UUID
        },
        created_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Account = require('./Account');

    return {
      owner: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: `${this.tableName}.owner_id`,
          to: `${Account.tableName}.id`
        }
      }
    };
  }

  static castValueToDefined(obj) {
    const { type, value } = obj;
    if (value === null || value === undefined) {
      return obj;
    }
    let coercedValue = value;
    if (type === 'string') {
      coercedValue = String(value);
    } else if (type === 'number') {
      coercedValue = Number(value);
    } else if (type === 'boolean') {
      coercedValue = Boolean(value);
    } else {
      throw this.createValidationError({ message: `Unsupported customField type: ${type}`, data: obj });
    }
    return _.chain(obj)
      .cloneDeep()
      .set('value', coercedValue)
      .value();
  }

  static stringifyValue(obj) {
    const { value } = obj;
    if (value === null || value === undefined) {
      return obj;
    }

    return _.chain(obj)
      .cloneDeep()
      .set('value', String(value))
      .value();
  }

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);
    return this.constructor.castValueToDefined(json);
  }

  $formatDatabaseJson(json) {
    json = super.$formatDatabaseJson(json);
    return this.constructor.stringifyValue(json);
  }
}

module.exports = CustomField;
