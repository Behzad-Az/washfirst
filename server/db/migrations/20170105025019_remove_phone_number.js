
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.dropColumn('phone_number');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.string('phone_number');
    })
  ]);
};