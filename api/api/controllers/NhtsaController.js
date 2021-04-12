
const BaseController = require('./BaseController');
const nhtsa = require('../services/nhtsa');
const { handleResponse, snakeCaseKeys } = require('../helpers/utils');

async function nhtsaVinLookup(req, res) {
  const pathParams = BaseController.Helper.getPathParams(req);
  const { vin } = pathParams;
  try {
    const { data } = await nhtsa.decodeVinExtended(vin);
    const formatted = nhtsa.formatVinDecode(data);
    handleResponse(undefined, {
      results: formatted,
      raw: data
    }, res);
  } catch (e) {
    handleResponse(e, null, res);
  }
}

module.exports = {
  nhtsaVinLookup
};
