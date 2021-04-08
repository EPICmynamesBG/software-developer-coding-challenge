'use strict';

const _ = require('lodash');
const BaseModel = require('./BaseModel.js');
const { UUID } = require('../helpers/constants');

class File extends BaseModel {
  static get tableName() {
    return 'files';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['account_id'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          pattern: UUID,
          example: '00000000-0000-0000-0000-000000000000'
        },
        account_id: {
          type: 'string',
          format: 'uuid',
          pattern: UUID,
          example: '00000000-0000-0000-0000-000000000000'
        },
        account_listing_id: {
          type: ['string', 'null'],
          example: '00000000-0000-0000-0000-000000000000'
        },
        file_type: {
          type: 'string'
        },
        file_name: {
          type: 'string'
        },
        file_size: {
          type: 'number'
        },
        file_encoding: {
          type: 'string'
        },
        storage_path: {
          type: 'string'
        },
        created_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Account = require('./Account');
    const AccountListing = require('./AccountListing');

    return {
      account: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: `${this.tableName}.account_id`,
          to: `${Account.tableName}.id`
        }
      },
      accountListing: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: AccountListing,
        join: {
          from: `${this.tableName}.account_listing_id`,
          to: `${AccountListing.tableName}.id`
        }
      }
    };
  }
}

module.exports = File;
