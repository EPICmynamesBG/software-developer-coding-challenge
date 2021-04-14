
const BaseController = require('./BaseController');
const NHTSA = require('../services/nhtsa');
const utils = require('../helpers/utils');

async function nhtsaVinLookup(req, res) {
  const pathParams = BaseController.Helper.getPathParams(req);
  const { vin } = pathParams;
  try {
    const { data } = await NHTSA.decodeVinExtended(vin);
    const formatted = NHTSA.formatVinDecode(data);
    utils.handleResponse(undefined, {
      results: formatted,
      raw: data
    }, res);
  } catch (e) {
    utils.handleResponse(e, undefined, res);
  }
}

module.exports = {
  nhtsaVinLookup
};
