
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (userTable) => {
    console.log('creating users table...');
    userTable
      .string('username')
      .primary()
      .unique()
      .notNullable();
    userTable
      .string('name')
      .notNullable();
    userTable
      .string('avatar_url');
  });
};

exports.down = function (knex, Promise) {
  console.log('dropping users table...');
  return knex.schema.dropTable('users');
};
