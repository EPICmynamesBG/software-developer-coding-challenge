
const BaseController = require('./BaseController');
const NHTSA = require('../services/nhtsa');
const { handleResponse } = require('../helpers/utils');

async function nhtsaVinLookup(req, res) {
  const pathParams = BaseController.Helper.getPathParams(req);
  const { vin } = pathParams;
  try {
    const output = await NHTSA.decodeVinExtended(vin);
    console.log('NHTSA', JSON.stringify(output));
    const { data } = output;
    const formatted = NHTSA.formatVinDecode(data);
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
