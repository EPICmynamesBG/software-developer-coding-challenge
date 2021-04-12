'use strict';

require('../../config/db').initModels();

const logger = require('../../api/helpers/logger');
// const logger = console;
const AccountListingService = require('../../api/services/AccountListingService').constructor;
const AccountListing = require('../../api/models/AccountListing');

process.on('uncaughtException', (e) => {
  logger.error(e);
  process.exit(1);
});

async function main() {
  const listings = await AccountListing.query()
    .select()
    .where('is_complete', false);
  
  const updatedStatus = listings.map(listing => AccountListingService.checkStatuses(listing, true));
  let failures = 0;
  let successes = 0;
  for (const listing of updatedStatus) {
    try {
      await AccountListing.query()
        .update(listing)
        .where('id', listing.id);
      successes += 1;
    } catch (e) {
      logger.error(e, listing);
      failures += 1;
    }
  }
  return {
    successes,
    failures
  };
}


main()
  .then((stats) => {
    logger.info('updateListingStatuses completed', stats);
    process.exit(0);
  })
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
