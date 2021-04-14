'use strict';

const _ = require('lodash');
const BaseModel = require('./BaseModel.js');
const { UUID, VIN } = require('../helpers/constants');

class AccountListing extends BaseModel {
  static get tableName() {
    return 'account_listings';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['account_id', 'vehicle_vin', 'end_at_timestamp'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          pattern: UUID,
          example: '00000000-0000-0000-0000-000000000000'
        },
        account_id: {
          type: 'string'
        },
        display: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            }
          }
        },
        vehicle_vin: {
          type: ['string', 'null'],
          pattern: VIN
        },
        vehicle_nhtsa_info: {
          type: 'object',
          default: {}
        },
        start_at_timestamp: {
          type: 'string',
          format: 'date-time'
          // default: now()
        },
        end_at_timestamp: {
          type: 'string',
          format: 'date-time'
        },
        is_active: {
          type: 'boolean',
          default: false
        },
        is_complete: {
          type: 'boolean',
          default: false
        },
        created_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get updateSchema() {
    const schema = { ...super.updateSchema };
    _.unset(schema, 'properties.account_id');
    schema.required = _.without(schema.required, 'account_id');
    return schema;
  }

  static get createSchema() {
    const schema = { ...super.createSchema };
    _.unset(schema, 'properties.account_id');
    schema.required = _.without(schema.required, 'account_id');
    return schema;
  }

  static get relationMappings() {
    /* eslint-disable global-require */
    const Account = require('./Account');
    const File = require('./File');
    const ListingBid = require('./ListingBid');
    /* eslint-enable global-require */

    return {
      account: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: `${this.tableName}.account_id`,
          to: `${Account.tableName}.id`
        }
      },
      photos: {
        relation: BaseModel.HasManyRelation,
        modelClass: File,
        join: {
          from: `${this.tableName}.id`,
          to: `${File.tableName}.account_listing_id`
        }
      },
      winningBid: {
        relation: BaseModel.HasOneRelation,
        modelClass: ListingBid,
        join: {
          from: `${this.tableName}.id`,
          to: `${ListingBid.tableName}.account_listing_id`
        },
        filter: (query) => query
          .orderBy('bid_value', 'desc')
          .limit(1)
      }
    };
  }
}

module.exports = AccountListing;
