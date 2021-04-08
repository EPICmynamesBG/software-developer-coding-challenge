'use strict';


/**
 * @typedef {object} fileObject
 * @property {Buffer} buffer
 * @property {string} fieldname
 * @property {string} originalname
 * @property {string} encoding
 * @property {number} size
 * @property {string} mimetype
 */

class FileStorageInterface {
  /**
   * @param {string} filePath
   * @param {string} fileName
   */
  constructor(filePath, fileName) {
    this._filePath = filePath;
    this._fileName = fileName;
    this._file = null;
    this._fileEncoding = undefined;
  }

  get storedAt() { return this._filePath; }
  get fileName() { return this._fileName; }

  /**
   * Load the stored file
   * @async
   * @return {any} file object
   */
  async $load() {
    throw new Error('Not Implemented');
  }

  /**
   * @async
   * @param {fileObject} file
   * @param {object} [options = {}]
   * @return {FileStorageInterface}
   */
  static async store() {
    throw new Error('Not Implemented');
  }

  static fromFileModel(fileModel) {
    return new this(fileModel.storage_path);
  }
}

module.exports = FileStorageInterface;
