process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const connection = require('../db/connection');

after(() => connection.destroy());
describe('', () => {
  it('', () => {
    
  });
});