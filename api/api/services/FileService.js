'use strict';

const { promisify } = require('util');
const _ = require('lodash');
const fs = require('fs');

const utils = require('../helpers/utils');
const File = require('../models/File');
const BaseService = require('./BaseService');
const LocalFileSystem = require('./interfaces/LocalFileSystem');

class FileService extends BaseService {
  constructor(buildPath = [], FileStorageInterface = LocalFileSystem) {
    super(File);

    this.buildPath = buildPath;
    /**
     * @type {function<FileStorageInterface>}
     */
    this.FileStorageInterface = FileStorageInterface;
  }

  async create(file, createFields) {
    const options = {
      rootDirectory: 'uploads',
      path: _.map(this.buildPath, (pathComponent) => {
        if (_.isFunction(pathComponent)) {
          return pathComponent(createFields);
        }
        return pathComponent;
      }),
      fileName: createFields.file_name
    };

    const interfaceInstance = await this.FileStorageInterface.store(file, options);
    const obj = {
      ...createFields,
      file_name: interfaceInstance.fileName,
      file_type: file.mimetype,
      file_encoding: file.encoding,
      file_size: file.size,
      storage_path: interfaceInstance.storedAt
    };
    return super.create(obj);
  }

  openReadStream(file) {
    const interfaceInstance = this.FileStorageInterface.fromFileModel(file);
    return interfaceInstance.openReadStream();
  }
}

module.exports = FileService;
