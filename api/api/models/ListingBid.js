'use strict';

const _ = require('lodash');
const BaseModel = require('./BaseModel.js');
const { UUID } = require('../helpers/constants');

class ListingBid extends BaseModel {
  static get tableName() {
    return 'listing_bids';
  }

  static get virtualAttributes() {
    return ['bid'];
  }

  /**
   * @type {number} bid_value as a number
   */
  get bid() {
    return Number.parseFloat(this.bid_value);
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['account_id', 'account_listing_id', 'bid_value'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          pattern: UUID,
          example: '00000000-0000-0000-0000-000000000000'
        },
        account_id: {
          description: 'Bid made by account',
          type: 'string',
          format: 'uuid',
          pattern: UUID,
          example: '00000000-0000-0000-0000-000000000000'
        },
        account_listing_id: {
          description: 'Listing the bid applies to',
          type: 'string',
          format: 'uuid',
          pattern: UUID,
          example: '00000000-0000-0000-0000-000000000000'
        },
        bid_value: {
          description: 'Bid amount as precise string number',
          type: 'string'
        },
        currency: {
          type: ['string'],
          default: 'USD'
        },
        // FUTURE
        // converted_bid_value: {
        //   description: 'Converted bid_value standardized and stored as USD',
        //   type: 'string'
        // },
        created_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get updateSchema() {
    const schema = { ...super.updateSchema };
    _.unset(schema, 'properties.account_id');
    _.unset(schema, 'properties.account_listing_id');
    schema.required = _.without(schema.required, 'account_id', 'account_listing_id');
    return schema;
  }

  static get createSchema() {
    const schema = { ...super.createSchema };
    _.unset(schema, 'properties.account_id');
    _.unset(schema, 'properties.account_listing_id');
    schema.required = _.without(schema.required, 'account_id', 'account_listing_id');
    return schema;
  }

  static get relationMappings() {
    /* eslint-disable global-require */
    const Account = require('./Account');
    const AccountListing = require('./AccountListing');
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
      listing: {
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

module.exports = ListingBid;
