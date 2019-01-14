
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (userTable) => {
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
  return knex.schema.dropTable('users');
};
