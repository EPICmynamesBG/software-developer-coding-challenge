module.exports = function useTestServer(testSuite, opts = {}) {
  const { useBefore = false, useBeforeEach = true } = opts;
  let app;

  testSuite.timeout(15000);

  function requireApp(done) {
    delete require.cache[require.resolve('../../app')];
    // eslint-disable-next-line global-require
    app = require('../../app', { bustCache: true });
    app.on('ready', done);
  }

  function closeServer(done) {
    app.server.close(done);
  }

  if (useBefore) {
    before(requireApp);

    after(closeServer);
  }

  if (useBeforeEach) {
    beforeEach(requireApp);

    afterEach(closeServer);
  }

  function getApp() {
    return app;
  }
  return getApp;
};
