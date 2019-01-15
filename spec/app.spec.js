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
    describe('/:topic/articles', () => {
      it('GET status 200 responds with articles for a given topic', () => {
        return request
          .get('/api/topics/mitch/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.keys('article_id', 'title', 'comment_count', 'body', 'votes', 'topic', 'username', 'created_at');
          });
      });
      it('GET status 404 responds with err if request is in valid format but does not exist', () => {
        return request
          .get('/api/topics/hello/articles')
          .expect(404)
          .then(({ body }) => {
            expect(body.message).to.equal('articles not found');
          });
      });
      it('GET status 200 has a default limit of 10', () => {
        return request
          .get('/api/topics/mitch/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(10);
          });
      });
      it('GET status 200 and can specify limit', () => {
        return request
          .get('/api/topics/mitch/articles?limit=4')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(4);
          });
      });
      it('GET status 200 defaults to sort_by created_at column and descending order', () => {
        return request
          .get('/api/topics/mitch/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
            expect(body.articles[9].title).to.equal('Am I a cat?');
          });
      });
      it('GET status 200 can specify sort_by and order', () => {
        return request
          .get('/api/topics/mitch/articles?sort_by=title&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.equal('A');
            expect(body.articles[9].title).to.equal('They\'re not exactly dogs, are they?');
          });
      });
      it('GET status 200 returns results default offset of 0 pages', () => {
        return request
          .get('/api/topics/mitch/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
          });
      });
      it('GET status 200 returns results offset by page number', () => {
        return request
          .get('/api/topics/mitch/articles?p=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.equal('Moustache');
          });
      });
      it('GET status 200 ignores other queries that aren\'t valid', () => {
        return request
          .get('/api/topics/mitch/articles?hello=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
          });
      });
      it('POST status 201 accepts an object containing title, body and username and sends back article that has been added', () => {
        const postBody = {
          title: 'This has worked',
          body: 'Yep. This has definitely worked',
          username: 'icellusedkars',
        };
        return request
          .post('/api/topics/cats/articles')
          .send(postBody)
          .expect(201)
          .then(({ body }) => {
            expect(body).to.have.keys('article_id', 'title', 'body', 'votes', 'topic', 'username', 'created_at');
          });
      });
      it('POST status 400 if unable to post due to the body not having the correct keys', () => {
        const postBody = {
          hello: 'This has worked',
          body: 'Yep this has worked',
          username: 'icellusedkars',
        };
        return request
          .post('/api/topics/cats/articles')
          .send(postBody)
          .expect(400);
      });
      it('POST status 400 if unable to post due to the topic not existing', () => {
        const postBody = {
          title: 'This has worked',
          body: 'Yep this has worked',
          username: 'icellusedkars',
        };
        return request
          .post('/api/topics/hi/articles')
          .send(postBody)
          .expect(400);
      });
      it('POST status 400 if unable to post due to the username not existing', () => {
        const postBody = {
          title: 'This has worked',
          body: 'Yep this has worked',
          username: 'ello',
        };
        return request
          .post('/api/topics/cats/articles')
          .send(postBody)
          .expect(400);
      });
    });
  });
  describe.only('/articles', () => {
    it('GET status 200 responds with articles containing the correct keys', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.have.keys('author', 'title', 'article_id', 'body', 'votes', 'comment_count', 'created_at', 'topic');
        });
    });
    it('GET status 200 has a default limit of 10', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
        });
    });
    it('GET status 200 and can specify limit', () => {
      return request
        .get('/api/articles?limit=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(2);
        });
    });
    it('GET status 200 defaults to sort_by created_at column and descending order', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
          expect(body.articles[9].title).to.equal('Seven inspirational thought leaders from Manchester UK');
        });
    });
    it('GET status 200 can specify sort_by and order', () => {
      return request
        .get('/api/articles?sort_by=author&order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].author).to.equal('butter_bridge');
          expect(body.articles[9].author).to.equal('rogersop');
        });
    });
    it('GET status 200 returns results default offset of 0 pages', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        });
    });
    it('GET status 200 returns results offset by page number', () => {
      return request
        .get('/api/articles?p=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Am I a cat?');
        });
    });
    // it('GET status 200 ignores other queries that aren\'t valid', () => {
    //   return request
    //     .get('/api/topics/mitch/articles?hello=2')
    //     .expect(200)
    //     .then(({ body }) => {
    //       expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
    //     });
    // });
  });
});
