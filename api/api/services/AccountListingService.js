'use strict';

const _ = require('lodash');
const moment = require('moment');
const { HttpError } = require('../helpers/utils');
const AccountListing = require('../models/AccountListing');
const BaseService = require('./BaseService');
const logger = require('../helpers/logger');

class AccountListingService extends BaseService {
  constructor() {
    super(AccountListing);
  }

  /**
   * Determine if a listing should be considered active
   * @param {*} record
   * @returns 
   */
  static isListingActive(record = {}) {
    if (record.is_complete) {
      return false;
    }
    if (moment(record.start_at_timestamp).isSameOrBefore(moment())) {
      if (moment(record.end_at_timestamp).isSameOrBefore(moment())) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Determine if a listing should be considered completed
   * @param {*} record
   * @returns 
   */
   static isListingComplete(record = {}) {
    if (record.is_complete) {
      return true;
    }
    return moment(record.end_at_timestamp).isSameOrBefore(moment());
  }

  /**
   * Check a listings active and complete states. Fix them if enabled
   * @param {AccountListing} record 
   * @param {boolean} [fix=true] fix the status(es) if determined to be wrong 
   * @returns 
   */
  static checkStatuses(record = {}, fix = true) {
    const shouldBeComplete = this.isListingComplete(record);
    const shouldBeActive = this.isListingActive(record);
    if (record.is_active !== shouldBeActive) {
      logger.info(`Listing expected vs actual status differ. is_active will${fix ? ' ' : ' not'} be updated`, {
        expected: shouldBeActive,
        actual: record.is_active,
        listing: record
      });
    }
    if (record.is_complete !== shouldBeComplete) {
      logger.info(`Listing expected vs actual status differ. is_complete will${fix ? ' ' : ' not'} be updated`, {
        expected: shouldBeComplete,
        actual: record.is_complete,
        listing: record
      });
    }
    if (fix) {
      const clone = _.cloneDeep(record);
      clone.is_active = shouldBeActive;
      clone.is_complete = shouldBeComplete;
      return clone;
    }
    return record;
  }

  static _collectionCheck(collection) {
    if (Array.isArray(collection)) {
      return collection.map(record => this.checkStatuses(record));
    }
    return this.checkStatuses(collection);
  }

  create(collection) {
    const toCreate = this.constructor._collectionCheck(collection);
    if (moment(toCreate.start_at_timestamp).isAfter(moment(toCreate.end_at_timestamp))) {
      throw new HttpError('End at must be after start at timestamp', 400, 'create');
    }
    return super.create(toCreate);
  }

  update(params, updateObj) {
    throw new Error('Bulk edit operation not yet supported for this object');
  }

  async updateById(id, updateObj) {
    const existing = await this.getById(id);
    if (existing.is_complete) {
      throw new HttpError('Completed listings cannot be modified', 400, 'update');
    }
    const now = moment();
    if (existing.is_active) {
      if (updateObj.start_at_timestamp && !moment(updateObj.start_at_timestamp).isSame(existing.start_at_timestamp)) {
        throw new HttpError('Start at timestamp cannot be updated for active listings', 400, 'update');
      }
    } else {
      if (updateObj.start_at_timestamp && moment(updateObj.start_at_timestamp).isBefore(now)) {
        throw new HttpError('Start at timestamp cannot be earlier than now', 400, 'update');
      }
    }
    if (updateObj.end_at_timestamp && moment(updateObj.end_at_timestamp).isSameOrBefore(now)) {
      throw new HttpError('End at timestamp cannot be at or before now. Please select a later time', 400, 'update');
    }
    const merged = {
      ...existing,
      ...updateObj
    };
    if (moment(merged.start_at_timestamp).isAfter(moment(merged.end_at_timestamp))) {
      throw new HttpError('End at must be after start at timestamp', 400, 'update');
    }

    const fixedStates = this.constructor.checkStatuses(merged, true);
    return super.updateById(id, fixedStates);
  }
}

module.exports = new AccountListingService();
