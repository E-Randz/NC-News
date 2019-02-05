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

  it('GET status 200 responds with JSON describing all available endpoints in API', () => {
    return request
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).to.be.an('object');
      });
  });
  // <=====/API/TOPICS====>
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
          expect(body.topic).to.have.keys('slug', 'description');
          expect(body.topic.slug).to.equal('Songs');
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
    it('POST status 400 error when some keys are missing', () => {
      const postBody = {
        slug: 'test',
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
    it('INVALID REQUEST status 405 when doing patch, delete and put requests to specific ID', () => {
      const invalidMethods = ['patch', 'delete', 'put'];
      const url = '/api/topics';
      const invalidRequests = invalidMethods.map((invalidMethod) => {
        return request[invalidMethod](url).expect(405);
      });
      return Promise.all(invalidRequests);
    });

    // <=====/API/TOPICS/:TOPIC/ARTICLES====>
    describe('/:topic/articles', () => {
      it('GET status 200 responds with articles for a given topic', () => {
        return request
          .get('/api/topics/mitch/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.keys('article_id', 'title', 'comment_count', 'votes', 'topic', 'author', 'created_at');
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
      it('GET status 400 if malformed p or limit', () => {
        return request
          .get('/api/topics/mitch/articles?limit=hey&p=what')
          .expect(400);
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
      it('GET status 200 ignores invalid sort by and order queries', () => {
        return request
          .get('/api/topics/mitch/articles?sort_by=test&order=what')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
            expect(body.articles[9].title).to.equal('Am I a cat?');
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
            expect(body.article).to.have.keys('article_id', 'title', 'body', 'votes', 'topic', 'username', 'created_at');
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
      it('POST status 400 if unable to post due to the body missing some keys', () => {
        const postBody = {
          title: 'Where did my body go?',
        };
        return request
          .post('/api/topics/cats/articles')
          .send(postBody)
          .expect(400);
      });
      it('POST status 404 if unable to post due to the topic not existing', () => {
        const postBody = {
          title: 'This has worked',
          body: 'Yep this has worked',
          username: 'icellusedkars',
        };
        return request
          .post('/api/topics/hi/articles')
          .send(postBody)
          .expect(404);
      });
      it('POST status 400 if trying to post empty object', () => {
        const postBody = {};
        return request
          .post('/api/topics/mitch/articles')
          .send(postBody)
          .expect(400);
      });
      it('POST status 404 if unable to post due to the username not existing', () => {
        const postBody = {
          title: 'This has worked',
          body: 'Yep this has worked',
          username: 'ello',
        };
        return request
          .post('/api/topics/cats/articles')
          .send(postBody)
          .expect(404);
      });
      it('INVALID REQUEST status 405 when doing patch, delete and put requests to specific ID', () => {
        const invalidMethods = ['patch', 'delete', 'put'];
        const url = '/api/topics/mitch/articles';
        const invalidRequests = invalidMethods.map((invalidMethod) => {
          return request[invalidMethod](url).expect(405);
        });
        return Promise.all(invalidRequests);
      });
    });
  });

  // <=====/API/ARTICLES====>
  describe('/articles', () => {
    it('GET status 200 responds with articles containing the correct keys', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.have.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic');
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
    it('GET status 200 ignores invalid sort by and order queries', () => {
      return request
        .get('/api/articles?sort_by=hgigiuy865&order=qwtfitqw')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
          expect(body.articles[9].title).to.equal('Seven inspirational thought leaders from Manchester UK');
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
        .get('/api/articles?p=2&limit=4')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('UNCOVERED: catspiracy to bring down democracy');
        });
    });
    it('GET status 400 if limit and p queries are invalid', () => {
      return request
        .get('/api/articles?limit=hey&p=120')
        .expect(400);
    });
    it('INVALID REQUEST status 405 when doing patch, delete and put requests to specific ID', () => {
      const invalidMethods = ['patch', 'delete', 'put'];
      const url = '/api/articles';
      const invalidRequests = invalidMethods.map((invalidMethod) => {
        return request[invalidMethod](url).expect(405);
      });
      return Promise.all(invalidRequests);
    });
    // <=====/API/ARTICLES/:ARTICLE_ID====>
    describe('/:article_id', () => {
      it('GET request status 200 sends one article object when passed a valid id', () => {
        return request
          .get('/api/articles/2')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.keys('author', 'title', 'article_id', 'body', 'votes', 'comment_count', 'created_at', 'topic');
            expect(body.article.title).to.equal('Sony Vaio; or, The Laptop');
          });
      });
      it('GET request status 404 sends error if article id is valid but does not exist in database', () => {
        return request
          .get('/api/articles/7654455')
          .expect(404)
          .then(({ body }) => {
            expect(body.message).to.equal('article could not be found');
          });
      });
      it('GET request status 400 sends error if article id is in an invalid format', () => {
        return request
          .get('/api/articles/ahgvag')
          .expect(400);
      });
      it('PATCH request status 200 responds with article that has been updated with vote count increased', () => {
        const patchBody = {
          inc_votes: 1,
        };
        return request
          .patch('/api/articles/3')
          .send(patchBody)
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(1);
          });
      });
      it('PATCH request status 200 responds with article that has been updated with vote count decreased', () => {
        const patchBody = {
          inc_votes: -70,
        };
        return request
          .patch('/api/articles/4')
          .send(patchBody)
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(-70);
          });
      });
      it('PATCH request status 400 if inc_votes query is invalid', () => {
        const patchBody = {
          inc_votes: 'hello',
        };
        return request
          .patch('/api/articles/4')
          .send(patchBody)
          .expect(400);
      });
      it('PATCH request status 200 returns unmodified body if no vote is passed', () => {
        return request
          .patch('/api/articles/1')
          .send()
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(100);
          });
      });
      it('PATCH request status 404 responds with error if the article ID does not exist', () => {
        const patchBody = {
          inc_votes: -70,
        };
        return request
          .patch('/api/articles/5656576')
          .send(patchBody)
          .expect(404)
          .then(({ body }) => {
            expect(body.message).to.equal('article could not be found');
          });
      });
      it('DELETE request status 204 and no content responds when valid article id is specified', () => {
        return request
          .delete('/api/articles/1')
          .expect(204)
          .then(({ body }) => {
            expect(body).to.eql({});
            // use connection object
            connection('comments')
              .select('*')
              .where('comments.article_id', '=', '1')
              .then((comments) => {
                expect(comments.length).to.equal(0);
              });
          });
      });
      it('DELETE request status 404 when delete request to valid id format but does not exist in database', () => {
        return request
          .delete('/api/articles/787')
          .expect(404)
          .then(({ body }) => {
            expect(body.message).to.equal('Cannot delete. Article ID does not exist');
          });
      });
      it('DELETE request status 400 when delete request to invalid format but does not exist in database', () => {
        return request
          .delete('/api/articles/hejhge')
          .expect(400);
      });
      it('INVALID REQUEST status 405 when doing post and put requests to specific ID', () => {
        const invalidMethods = ['post', 'put'];
        const url = '/api/articles/1';
        const invalidRequests = invalidMethods.map((invalidMethod) => {
          return request[invalidMethod](url).expect(405);
        });
        return Promise.all(invalidRequests);
      });

      // <=====/API/ARTICLES/:ARTICLE_ID/COMMENTS====>
      describe('/comments', () => {
        it('GET request status 200 responds with array of comments for the given article id', () => {
          return request
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments[0]).to.have.keys('author', 'body', 'created_at', 'votes', 'comment_id');
            });
        });
        it('GET request status 404 responds when passed valid article id but article does not exist', () => {
          return request
            .get('/api/articles/69669/comments')
            .expect(404)
            .then(({ body }) => {
              expect(body.message).to.equal('No comments for this article');
            });
        });
        it('GET request status 400 responds with invalid article id', () => {
          return request
            .get('/api/articles/jhkuffgh/comments')
            .expect(400);
        });
        it('GET status 200 has a default limit of 10', () => {
          return request
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.have.length(10);
            });
        });
        it('GET status 200 and can specify limit', () => {
          return request
            .get('/api/articles/1/comments?limit=3')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.have.length(3);
            });
        });
        it('GET status 200 defaults to sort_by created_at column and descending order', () => {
          return request
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments[0].body).to.equal('The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.');
              expect(body.comments[9].body).to.equal('Ambidextrous marsupial');
            });
        });
        it('GET status 200 can specify sort_by and order', () => {
          return request
            .get('/api/articles/1/comments?sort_by=votes&order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments[0].votes).to.equal(-100);
              expect(body.comments[9].votes).to.equal(0);
            });
        });
        it('GET status 200 returns results default offset of 0 pages', () => {
          return request
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments[0].body).to.equal('The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.');
            });
        });
        it('GET status 200 returns results offset by page number', () => {
          return request
            .get('/api/articles/1/comments?limit=4&p=2')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments[0].body).to.equal('I hate streaming eyes even more');
            });
        });
        it('GET status 200 ignores other queries that aren\'t valid', () => {
          return request
            .get('/api/articles/9/comments?heythere=ghfassa')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).to.equal(2);
            });
        });
        it('POST request status 201 accepts a username and body and returns the newly added comment', () => {
          const postBody = {
            username: 'icellusedkars',
            body: 'this is the comment',
          };
          return request
            .post('/api/articles/2/comments')
            .send(postBody)
            .expect(201)
            .then(({ body }) => {
              expect(body.comment.comment_id).to.equal(19);
              expect(body.comment).to.have.keys('body', 'username', 'article_id', 'votes', 'created_at', 'comment_id');
            });
        });
        it('POST status 400 if unable to post due to the body not having the correct keys', () => {
          const postBody = {
            hello: 'This has worked',
            body: 'Yep this has worked',
          };
          return request
            .post('/api/articles/2/comments')
            .send(postBody)
            .expect(400);
        });
        it('POST status 404 if unable to post due to the article not existing', () => {
          const postBody = {
            username: 'icellusedkars',
            body: 'this is the comment',
          };
          return request
            .post('/api/articles/8896/comments')
            .send(postBody)
            .expect(404);
        });
        it('POST status 404 if unable to post due to the username not existing', () => {
          const postBody = {
            body: 'Yep this has worked',
            username: 'ello',
          };
          return request
            .post('/api/articles/2/comments')
            .send(postBody)
            .expect(404);
        });
        it('INVALID REQUEST status 405 when doing patch, delete and put requests to specific ID', () => {
          const invalidMethods = ['patch', 'delete', 'put'];
          const url = '/api/articles/2/comments';
          const invalidRequests = invalidMethods.map((invalidMethod) => {
            return request[invalidMethod](url).expect(405);
          });
          return Promise.all(invalidRequests);
        });

        // <=====/API/ARTICLES/:ARTICLE_ID/COMMENTS/:COMMENT_ID====>
        describe('/:comment_id', () => {
          it('PATCH request status 200 responds with comment that has been updated with vote count increased', () => {
            const patchBody = {
              inc_votes: 1,
            };
            return request
              .patch('/api/articles/1/comments/2')
              .send(patchBody)
              .expect(200)
              .then(({ body }) => {
                expect(body.comment.votes).to.equal(15);
              });
          });
          it('PATCH request status 200 responds with article that has been updated with vote count decreased', () => {
            const patchBody = {
              inc_votes: -10,
            };
            return request
              .patch('/api/articles/1/comments/2')
              .send(patchBody)
              .expect(200)
              .then(({ body }) => {
                expect(body.comment.votes).to.equal(4);
              });
          });
          it('PATCH request status 400 if inc_votes is not a number', () => {
            const patchBody = {
              inc_votes: 'vjhhvjh',
            };
            return request
              .patch('/api/articles/1/comments/2')
              .send(patchBody)
              .expect(400);
          });
          it('PATCH request status 200 if no body is sent', () => {
            return request
              .patch('/api/articles/1/comments/2')
              .send({})
              .expect(200)
              .then(({ body }) => {
                expect(body.comment.votes).to.equal(14);
              });
          });
          it('PATCH request status 404 responds with error if the article ID does not exist', () => {
            const patchBody = {
              inc_votes: -70,
            };
            return request
              .patch('/api/articles/68787/comments/2')
              .send(patchBody)
              .expect(404)
              .then(({ body }) => {
                expect(body.message).to.equal('comment could not be found');
              });
          });
          it('PATCH request status 404 responds with error if the comment ID does not exist', () => {
            const patchBody = {
              inc_votes: -70,
            };
            return request
              .patch('/api/articles/1/comments/6556')
              .send(patchBody)
              .expect(404)
              .then(({ body }) => {
                expect(body.message).to.equal('comment could not be found');
              });
          });
          it('DELETE request status 204 and no content responds when valid article id is specified', () => {
            return request
              .delete('/api/articles/1/comments/2')
              .expect(204)
              .then(({ body }) => {
                expect(body).to.eql({});
              });
          });
          it('DELETE request status 404 when article_id exists but comment_id does not', () => {
            return request
              .delete('/api/articles/1/comments/67867')
              .expect(404)
              .then(({ body }) => {
                expect(body.message).to.equal('Cannot delete. Article or Comment ID does not exist');
              });
          });
          it('DELETE request status 404 when article_id does not exist', () => {
            return request
              .delete('/api/articles/576587/comments/2')
              .expect(404)
              .then(({ body }) => {
                expect(body.message).to.equal('Cannot delete. Article or Comment ID does not exist');
              });
          });
          it('DELETE request status 400 when delete request to invalid format', () => {
            return request
              .delete('/api/articles/hejhge/comments/hggh')
              .expect(400);
          });
          it('INVALID REQUEST status 405 when doing get, post and put requests to specific ID', () => {
            const invalidMethods = ['get', 'post', 'put'];
            const url = '/api/articles/2/comments/1';
            const invalidRequests = invalidMethods.map((invalidMethod) => {
              return request[invalidMethod](url).expect(405);
            });
            return Promise.all(invalidRequests);
          });
        });
      });
    });
  });

  // <========/API/USERS==========>
  describe('/users', () => {
    it('GET status 200 responds with array of user objects', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).to.equal(3);
          expect(body.users[0]).to.have.keys('username', 'avatar_url', 'name');
        });
    });
    it('INVALID REQUEST status 405 when doing patch, put and delete requests to specific ID', () => {
      const invalidMethods = ['patch', 'delete', 'put'];
      const url = '/api/users';
      const invalidRequests = invalidMethods.map((invalidMethod) => {
        return request[invalidMethod](url).expect(405);
      });
      return Promise.all(invalidRequests);
    });

    // <=======/API/USERS/:USERNAME=========>
    describe('/:username', () => {
      it('GET status 200 responds with object containing correct user', () => {
        return request
          .get('/api/users/icellusedkars')
          .expect(200)
          .then(({ body }) => {
            expect(body.user.username).to.equal('icellusedkars');
            expect(body.user).to.have.keys('username', 'avatar_url', 'name');
          });
      });
      it('GET status 404 responds with error if username in valid syntax but does not exist', () => {
        return request
          .get('/api/users/768687')
          .expect(404)
          .then(({ body }) => {
            expect(body.message).to.equal('user with the provided username does not exist');
          });
      });
      it('INVALID REQUEST status 405 when doing patch, put and delete requests to specific ID', () => {
        const invalidMethods = ['post', 'patch', 'put', 'delete'];
        const url = '/api/users/icellusedkars';
        const invalidRequests = invalidMethods.map((invalidMethod) => {
          return request[invalidMethod](url).expect(405);
        });
        return Promise.all(invalidRequests);
      });
    });
  });
});
