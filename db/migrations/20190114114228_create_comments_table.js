
exports.up = function (knex, Promise) {
  console.log('creating comments table...');
  return knex.schema.createTable('comments', (commentTable) => {
    commentTable
      .increments('comment_id')
      .primary()
      .unique()
      .notNullable();
    commentTable
      .string('username')
      .references('users.username')
      .notNullable();
    commentTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable();
    commentTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    commentTable
      .timestamp('created_at')
      .defaultTo(knex.fn.now())
      .notNullable();
    commentTable
      .text('body')
      .notNullable();
  });
};

exports.down = function (knex, Promise) {
  console.log('dropping comments table...');
  return knex.schema.dropTable('comments');
};
