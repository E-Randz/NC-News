
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articleTable) => {
    articleTable
      .increments('article_id')
      .primary()
      .unique()
      .notNullable();
    articleTable
      .string('title')
      .notNullable();
    articleTable
      .text('body')
      .notNullable();
    articleTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    articleTable
      .string('topic')
      .references('topics.slug');
    articleTable
      .string('username')
      .references('users.username')
      .notNullable();
    articleTable
      .timestamp('created_at')
      .defaultTo(knex.fn.now())
      .notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
