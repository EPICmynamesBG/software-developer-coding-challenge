
module.exports = function useTestServer(testSuite, opts = {}) {
  const { useBefore = false, useBeforeEach = true } = opts;
  let app;

  testSuite.timeout(15000);

  if (useBefore) {
    before((done) => {
      delete require.cache[require.resolve('../../app')];
      app = require('../../app', { bustCache: true });
      app.on('ready', done);
    });
  
    after((done) => {
      app.server.close(done);
    });

  }

  if (useBeforeEach) {
    beforeEach((done) => {
      delete require.cache[require.resolve('../../app')];
      app = require('../../app', { bustCache: true });
      app.on('ready', done);
    });
  
    afterEach((done) => {
      app.server.close(done);
    });
  }


  function getApp() {
    return app;
  }
  return getApp;
}