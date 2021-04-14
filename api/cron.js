'use strict';

const cron = require('node-cron');
const { spawn } = require('child_process');
const logger = require('./api/helpers/logger');

cron.schedule('* * * * *', () => {
  logger.log('run ./bin/updateListingStatuses');
  const spawned = spawn('node', ['./bin/updateListingStatuses']);
  spawned.stdout.on('data', (data) => {
    logger.log(data.toString());
  });
  spawned.stderr.on('data', (data) => {
    logger.error(data.toString());
  });
  spawned.on('close', (code) => {
    logger.log('updateListingStatuses completed with status code', code);
  });
});

logger.log('cron scheduled');
