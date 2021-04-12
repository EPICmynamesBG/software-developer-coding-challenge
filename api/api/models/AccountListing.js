'use strict';

const _ = require('lodash');
const BaseModel = require('./BaseModel.js');
const { UUID, VIN, YEAR } = require('../helpers/constants');
const nhtsa = require('../services/nhtsa');

class AccountListing extends BaseModel {
  // constructor(...args) {
  //   super(...args);
  //   this.$make = null;
  //   this.$model = null;
  //   this.$manufacturer = null;
  //   this.$vinDetails = null;
  // }

  static get tableName() {
    return 'account_listings';
  }

  // static get virtualAttributes() {
  //   return ['model', 'make', 'manufacturer', 'vinDetails'];
  // }

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
          properties: {
            make_id: {
              type: 'string'
            },
            manufacturer_id: {
              type: 'string'
            },
            model_id: {
              type: 'string'
            },
            model_year: {
              type: 'number',
              pattern: YEAR
            },
            series: {
              type: ['string', 'null']
            },
            trim_level: {
              type: ['string', 'null']
            }
          },
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
    const Account = require('./Account');
    const CustomField = require('./CustomField');
    const File = require('./File');
    const ListingBid = require('./ListingBid');

    return {
      account: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: `${this.tableName}.account_id`,
          to: `${Account.tableName}.id`
        }
      },
      customFields: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: CustomField,
        join: {
          from: `${this.tableName}.id`,
          through: {
            from: 'account_vehicles_custom_fields.account_vehicle_id',
            to: 'account_vehicles_custom_fields.custom_field_id'
          },
          to: `${CustomField.tableName}.id`
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
        filter: query => query
          .orderBy('bid_value', 'desc')
          .limit(1)
      }
    };
  }

  // get model() {
  //   return this.$model;
  // }

  // get make() {
  //   return this.$make;
  // }

  // get manufacturer() {
  //   return this.$manufacturer;
  // }

  // get vinDetails() {
  //   return this.$vinDetails;
  // }

  // async $loadModel() {
  //   if (!this.$model) {
  //     const { data } = await nhtsa.getModelsForMakeIdAndYear(this.make_id, this.model_year);
  //     this.$model = _.find(data.Results, { Model_ID: Number(this.model_id), Make_ID: Number(this.make_id) });
  //   }
  //   return this;
  // }

  // async $loadManufacturer() {
  //   if (!this.$manufacturer) {
  //     const { data } = await nhtsa.getManufacturerDetails(this.manufacturer_id);
  //     this.$manufacturer = data.Results[0];
  //   }
  //   return this;
  // }

  // async $loadMake() {
  //   if (!this.$make) {
  //     const { data } = await nhtsa.getMakesForManufacturerAndYear(this.manufacturer_id, this.model_year);
  //     this.$make = _.find(data.Results, { MakeId: Number(this.make_id) });
  //   }
  //   return this;
  // }

  // async $loadVinDetails() {
  //   if (!this.$vinDetails && this.vin) {
  //     const { data } = await nhtsa.decodeVinExtended(this.vin);
  //     this.$vinDetails = data.Results;
  //   }
  // }

  // async $loadVirtuals() {
  //   await Promise.all([
  //     this.$loadMake(),
  //     this.$loadModel(),
  //     this.$loadManufacturer(),
  //     this.$loadVinDetails()
  //   ]);
  //   return this;
  // }

  // async _generateDisplayName() {
  //   await this.$loadVirtuals();
  //   const nameFields = [this.model_year, this.make.Make_Name, this.model.Model_Name,
  //     this.series, this.trim_level].filter(val => !_.isNil(val));
  //   return _.toUpper(nameFields.join(' '));
  // }

  // $afterGet() {
  //   console.log(this);
  //   this.$make = _.get(this.vehicle_nhtsa_info, 'make_id');
  //   // return this.$loadVirtuals();
  // }

  // async $afterInsert(queryContext) {
  //   await super.$afterInsert(queryContext);
  //   return this.$loadVirtuals();
  // }

  // async $afterUpdate(opt, queryContext) {
  //   await super.$afterUpdate(opt, queryContext);
  //   return this.$loadVirtuals();
  // }

  // async $beforeInsert(queryContext) {
  //   await super.$beforeInsert(queryContext);
  //   if (!this.display_name) {
  //     this.display_name = await this._generateDisplayName();
  //   }
  // }


  //
  // async validateNhtsaFields(json) {
  //   const outputs = await Promise.all([
  //     ,
  //     ,
  //     nhtsa.getModelsForMakeIdAndYear(json.make_id, json.model_year),
  //     json.vin ? nhtsa.decodeVin(json.vin, undefined, json.model_year) : null
  //   ]);
  //   const [manufacturerDetails, makes, models, vin] = _.map(outputs, 'data.Results');
  //   console.log(outputs);
  //   if (!manufacturerDetails) {
  //     throw this.constructor.createValidationError({ message: 'manufacturer_id invalid' });
  //   }
  //   if (!makes) {
  //     throw this.constructor.createValidationError({ message: 'make_id invalid' });
  //   }
  //   if (!models) {
  //     throw this.constructor.createValidationError({ message: 'model_id invalid' });
  //   }
  //   if (json.vin && !vin) {
  //     throw this.constructor.createValidationError({ message: 'vin invalid' });
  //   }
  // }
  //
  // async $afterValidate(json, opt) {
  //   await super.$afterValidate(json, opt);
  //   await this.validateNhtsaFields(json);
  // }
}

module.exports = AccountListing;
