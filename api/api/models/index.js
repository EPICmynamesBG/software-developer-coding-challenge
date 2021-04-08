'use strict';

const fs = require('fs');

fs.readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js' && file !== 'BaseModel.js') {
    const name = file.replace('.js', '');
    // eslint-disable-next-line global-require,import/no-dynamic-require
    exports[name] = require(`./${file}`);
  }
});
