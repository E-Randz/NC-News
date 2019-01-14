process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const connection = require('../db/connection');


describe('/api', () => {
  beforeEach(() => {
    return connection.migrate.rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run());
  });
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
    it('GET request status: 201 responds with array of objects with new topic added', () => {
      const postBody = { slug: 'Songs', description: 'All your signsongy needs' };
      return request
        .post('/api/topics')
        .send(postBody)
        .expect(201)
        .then(({ body }) => {
          expect(body.topics.length).to.equal(3);
        });
    });
  });
});
