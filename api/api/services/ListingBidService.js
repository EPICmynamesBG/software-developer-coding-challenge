'use strict';

const ListingBid = require('../models/ListingBid');
const BaseService = require('./BaseService');

class ListingBidService extends BaseService {
  constructor() {
    super(ListingBid);
  }
}

module.exports = new ListingBidService();
