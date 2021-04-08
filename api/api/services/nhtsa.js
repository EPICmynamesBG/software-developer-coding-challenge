'use strict';

const nhtsa = require('nhtsa');

class NHTSA extends nhtsa {
  // Get Models for Make by Make Id
  // /vehicles/GetModelsForMakeId/440?format=json
  static getModelsForMakeId(make, format = this.DEFAULT_FORMAT) {
    return new Promise((resolve, reject) => {
      const queryString = `?format=${format}`;
      const url = `${this.URL_BASE}/GetModelsForMakeId/${make}${queryString}`;

      return this.makeRequest(url, resolve, reject);
    });
  }

  // Get Models for Make by Make Id and Model Year
  // /vehicles/GetModelsForMakeId/440/modelyear/2018?format=json
  static getModelsForMakeIdAndYear(make, year, format = this.DEFAULT_FORMAT) {
    return new Promise((resolve, reject) => {
      const queryString = `?format=${format}`;
      const url = `${this.URL_BASE}/GetModelsForMakeIdYear/makeId/${make}/modelyear/${year}${queryString}`;

      return this.makeRequest(url, resolve, reject);
    });
  }

  // OVERRIDE
  // Get Makes for Manufacturer by Manufacturer Name and Year
  // /vehicles/GetMakesForManufacturerAndYear/mer?year=2013&format=json
  static getMakesForManufacturerAndYear(manufacturer, year, format = this.DEFAULT_FORMAT) {
    return new Promise((resolve, reject) => {
      const queryString = `?year=${year}&format=${format}`;
      const url = `${this.URL_BASE}/GetMakesForManufacturerAndYear/${manufacturer}${queryString}`;

      return this.makeRequest(url, resolve, reject);
    });
  }
}

module.exports = NHTSA;
