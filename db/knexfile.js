// Update with your config settings.
"use strict"

// const config = require('./config_heroku');
const config = require('./config_local');

module.exports = {

  development: {
    client: 'pg',
    connection: config,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
