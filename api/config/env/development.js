

 module.exports = {
  datastores: {
    default: {
      // adapter: 'sails-mysql',
      // url: 'mysql://user:password@host:port/database',
      // ssl: true,
    },

  },



  models: {
    migrate: 'safe',
    // cascadeOnDestroy: false,
  },

  blueprints: {
    shortcuts: false,
  },
  security: {
    cors: {
      // allowOrigins: [
      //   'https://example.com',
      // ]
    },
  },
  session: {
    adapter: '@sailshq/connect-redis',
    url: 'redis://admin@redis:6379/session',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_session__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //
    //--------------------------------------------------------------------------



    cookie: {
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    },

  },



  sockets: {
    // onlyAllowOrigins: [
    //   'https://example.com',
    //   'https://staging.example.com',
    // ],


    // adapter: '@sailshq/socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/databasenumber',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_sockets__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //--------------------------------------------------------------------------

  },


  log: {
    level: 'debug'
  },



  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year
    // trustProxy: true,
  },
  port: 3000,
  // ssl: undefined,



  /**************************************************************************
  *                                                                         *
  * Production overrides for any custom settings specific to your app.      *
  * (for example, production credentials for 3rd party APIs like Stripe)    *
  *                                                                         *
  * > See config/custom.js for more info on how to configure these options. *
  *                                                                         *
  ***************************************************************************/
  custom: {
    baseUrl: 'https://example.com',
    internalEmailAddress: 'support@example.com',

    // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
    // stripeSecret: 'sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking them in to version control, you might opt to
    // ||   set sensitive credentials like these using environment variables.
    //
    // For example:
    // ```
    // sendgridSecret=SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU
    // sails_custom__stripeSecret=sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm
    // ```
    //--------------------------------------------------------------------------

  },

};
