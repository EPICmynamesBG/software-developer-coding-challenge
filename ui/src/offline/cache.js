import * as db from './db';

export function cacheRequest(url, payload, method = 'POST', fullRequest) {
  var request = db.getObjectStore('TEST', 'readwrite')
    .add({
      url,
      payload,
      method
    });
  request.onsuccess = function cacheRequestSuccess(event) {
    console.log(event);
  }
  request.onerror = function cacheRequestError(err) {
    console.error(err);
  }
}
