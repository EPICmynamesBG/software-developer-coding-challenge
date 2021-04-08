'use strict';

const _ = require('lodash');
const fs = require('fs');
const { promisify } = require('util');

const FileStorageInterface = require('./FileStorageInterface');
const utils = require('../../helpers/utils');

class LocalFileSystem extends FileStorageInterface {
  /**
   * Load the stored file
   * @async
   * @return {any} file object
   */
  async $load() {
    if (!this._file) {
      this._file = await promisify(fs.readFile)(this._filePath, this._fileEncoding);
    }
    return this._file;
  }

  /**
   * @async
   * @param  {fileObject} file
   * @return {LocalFileSystem}
   */
  static async store(fileObject, options = {}) {
    const {
      rootDirectory = 'uploads',
      path = []
    } = options;
    const fileName = utils.cleanseFileName(options.fileName || fileObject.originalname, fileObject.originalname);
    const fullPath = await this.buildFilePath(rootDirectory, ...path, fileName);
    if (this.fileAlreadyExists(fullPath)) {
      throw new utils.HttpError('File already exists at path', 400);
    }
    await promisify(fs.writeFile)(fullPath, fileObject.buffer);
    return new this(fullPath, fileName);
  }

  /**
   * @async
   * @param  {...any} args file path to build
   * @return {string}
   */
  static async buildFilePath(...args) {
    const filePath = [...args].filter(val => !_.isNil(val)).join('/');
    const path = filePath.split('/');
    path.pop();
    await promisify(fs.mkdir)(path.join('/'), { recursive: true });
    return filePath;
  }

  static fileAlreadyExists(fullPath) {
    return fs.existsSync(fullPath);
  }
}

module.exports = LocalFileSystem;
