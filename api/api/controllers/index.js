'use strict';

const fs = require('fs');

const exclude = ['index.js', 'BaseController.js', 'FileController.js', 'NhtsaController.js']

fs.readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.match(/\.js$/) !== null && !exclude.includes(file)) {
    const name = file.replace('.js', '');
    // eslint-disable-next-line global-require,import/no-dynamic-require
    exports[name] = require(`./${file}`);
  }
});
