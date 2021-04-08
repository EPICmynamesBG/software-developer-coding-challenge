'use strict';

const _ = require('lodash');
const async = require('async');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../../config/config');
const BaseModel = require('./BaseModel.js');
const { ROLES, UUID } = require('../helpers/constants');

class Account extends BaseModel {
  static get tableName() {
    return 'accounts';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['email', 'password'],
      'x-encrypt': ['password'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          pattern: UUID,
          example: '00000000-0000-0000-0000-000000000000'
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'johnny.appleseed@example.org'
        },
        password: {
          type: 'string',
          // format: 'encrypted',
          example: '********'
        },
        created_at: { type: 'string', format: 'date-time' },
        role: {
          type: 'string',
          enum: [
            ROLES.STANDARD,
            ROLES.ADMIN
          ],
          default: ROLES.STANDARD
        }
      }
    };
  }

  static get relationMappings() {
    return {};
  }

  $toJson() {
    const obj = super.$toJson();
    delete obj.password;
    return obj;
  }

  async $beforeInsert() {
    if (this.password) {
      const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
      this.password = hash;
    }
    _.unset(this, 'role');
  }

  async $beforeUpdate(opt) {
    const { old } = opt;
    if (this.password && this.password !== old.password) {
      const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
      this.password = hash;
    }
    _.unset(this, 'role');
  }

  validatePasswordSync(password) {
    return bcrypt.compareSync(password, this.password);
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static async getByEmail(email) {
    return this.query()
      .findOne({ email });
  }

  static async login(email, password) {
    if (!email || !password) {
      throw new Error('Missing required params');
    }
    const account = await this.getByEmail(email);
    if (!account) {
      return null;
    }
    await account.validatePassword(password);
    return account;
  }
}

module.exports = Account;
