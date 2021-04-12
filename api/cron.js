'use strict';

const cron = require('node-cron');
const { spawn } = require('child_process');

cron.schedule('* * * * *' , () => {
  console.log('run ./bin/updateListingStatuses');
  const spawned = spawn('node', ['./bin/updateListingStatuses']);
  spawned.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  spawned.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  spawned.on('close', (code) => {
    console.log('updateListingStatuses completed with status code', code);
  });
});

console.log('cron scheduled');
