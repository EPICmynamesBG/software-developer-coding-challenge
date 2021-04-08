
const dbName = 'trdrev';

export function openDatabase() {
  if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Offline upload caching will be unavailable.");
    return;
  }
  const dbOpen = indexedDB.open(dbName, window.IDB_VERSION);

  dbOpen.onerror = function dbError(error) {
    console.error('dbError', error);
  }
  dbOpen.onupgradeneeded = function dbUpgradeNeeded() {
    // This should only execute if there's a need to
    // create/update db.
    this.result.createObjectStore('requests', {
      autoIncrement: true, keyPath: 'id'
    });
  }
  dbOpen.onsuccess = function dbOpenSuccess() {
    window.appDb = this.result;
  }
}

export function getObjectStore(storeName, mode) {
  return window.appDb.transaction(storeName, mode)
    .objectStore(storeName);
}
