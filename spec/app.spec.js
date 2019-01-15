process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const connection = require('../db/connection');


describe('/api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());
  describe('/topics', () => {
    it('GET request status:200 responds with array of objects, each containing slug and description', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics[0]).to.have.keys('slug', 'description');
          expect(body.topics[1]).to.have.keys('slug', 'description');
        });
    });
    it('POST request status: 201 responds with the new object that was added', () => {
      const postBody = { slug: 'Songs', description: 'All your singsongy needs' };
      return request
        .post('/api/topics')
        .send(postBody)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic[0]).to.have.keys('slug', 'description');
          expect(body.topic[0].slug).to.equal('Songs');
        });
    });
    it('POST status 400 error when passed a malformed body', () => {
      const postBody = {
        animal: 'Giraffe',
      };
      return request
        .post('/api/topics')
        .send(postBody)
        .expect(400);
    });
    it('POST request status: 422 responds with error when unique id already exists in database', () => {
      const postBody = {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
      };
      return request
        .post('/api/topics')
        .send(postBody)
        .expect(422);
    });
    describe.only('/:topic/articles', () => {
      it('GET status 200 responds with articles for a given topic', () => {
        return request
          .get('/api/topics/mitch/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.keys('article_id', 'title', 'comment_count', 'body', 'votes', 'topic', 'username', 'created_at');
          });
      });
    });
  });
});
