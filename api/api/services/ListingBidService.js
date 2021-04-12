'use strict';

const { HttpError } = require('../helpers/utils');
const ListingBid = require('../models/ListingBid');
const BaseService = require('./BaseService');

class ListingBidService extends BaseService {
  constructor() {
    super(ListingBid);
  }

  async getCurrentListingMaxBid(listingId) {
    const { max = null } = await this.modelClass.query()
      .max('bid_value')
      .where('account_listing_id', listingId)
      .limit(1)
      .first();
    return max;
  }

  async create(collection) {
    if (Array.isArray(collection)) {
      throw new Error('Only single object insert supported at this time');
    }

    const listingId = collection.account_listing_id;
    const currentMaxBid = await this.getCurrentListingMaxBid(listingId);
    if (currentMaxBid !== null && Number.parseFloat(collection.bid_value) <= Number.parseFloat(currentMaxBid)) {
      throw new HttpError('Bid must exceed the current bid', 400, 'create');
    }
    return super.create(collection);
  }
}

module.exports = new ListingBidService();
