# Northcoders News

Northcoders News is a back-end API app project that serves up current news based on a selection of topics. Users can add new articles, comment on articles and vote on them. Here is a link to the hosted API:

https://northcoders-news-project.herokuapp.com/

For a full list of end-points please go to the following link:

https://northcoders-news-project.herokuapp.com/api

## Getting Started

To get this running on your local machine, please do the following:

1. Fork this repo.
2. Clone the repo in your terminal using the following command:

```
git clone https://github.com/<your-username>/BE2-NC-Knews.git
```

### Prerequisites

This project uses the following software, which will need to be installed before proceeding to the next steps:

1. **PostgreSQL v11.0**
    * Go to https://postgresapp.com/downloads.html to download.
    * Install PostgreSQL using the instructions provided: https://postgresapp.com/documentation/install.html
    * Once installed, make sure PostgreSQL is running by clicking 'Start'.
    * Ensure that it's running by typing, which should give you the version number:
    ```bash
    postgres -V
    ```

2. **Node v11.1.0**
    * Go to https://nodejs.org/en/download/ and select the relevent download for your OS.
    * Install node and ensure that it was successul using the following command, which should give you the version number:
    ```bash
    node -v
    ```
3. **Mocha v5.2.0**
    - Testing framework for JavaScript.
    - https://mochajs.org/
    - To install globally
    ```bash
    npm i -g mocha
    ```
    - To install locally, navigate to the root of the project and run:
    ```bash
    npm i mocha
    ```

4. **VS Code (optional)**
    * This project was created in VS Code. Please either install this or use your preferred text editor.
    * https://code.visualstudio.com/download
5. **A browser**
    - Google Chrome was used in the development of this API.
    - https://www.google.com/chrome/

6. **Postman** 
    - Useful to make requests to the API
    - https://www.getpostman.com/downloads/

### Installing and Running in local development environment

##### 1.Installing Dependencies

Once you have the above prerequisites installed, navigate to the root of your cloned repo and run the following command to install the dependencies listed in the package.json:

```bash
npm install
```
This installs the following in node_modules:
```json
  "dependencies": {
    "body-parser": "^1.18.3",
    "express": "^4.16.4",
    "knex": "^0.15.2",
    "pg": "^7.6.1"
  },
  "devDependencies": {
    "chai": "^4.2.0",
    "eslint": "^5.9.0",
    "eslint-config-airbnb": "^17.1.0",
    "eslint-plugin-import": "^2.14.0",
    "husky": "^1.1.4",
    "nodemon": "^1.18.9",
    "supertest": "^3.3.0"
  }
```
##### 2. Setting up knexfile.js
The *knexfile.js* contains key settings to enable knex to interact with the correct PostgreSQL database in different environments: test/development/production.

Create a knexfile.js in the root of your project and populate it with the following:

```js
const { DB_URL } = process.env; /* <<< will change depending on the 
                                environment you are working in */

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'nc_knews',
      // user: '<name>', (linux users only)
      // password: '<password>', (linux users only)
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'nc_knews_test',
      // user: '<name>', (linux users only)
      // password: '<password>', (linux users only)
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
};
```
##### 3. Setting up the PostgreSQL database.
Before running in a local development environment, you will need to set up a PostgreSQL database. Run the following command in the root of your project to create the database.

```bash
psql -f ./db/dev_setup.sql
```
Ensure that this command has worked by connecting to psql in your terminal:
```bash
psql
```
Then list the available databases by entering the following:
```bash
\l
```
Quit psql by entering:
```bash
\q
```
##### 4. Migrating and seeding the database
To create the tables required in your database and seed it with development data, run the terminal command:
```bash
npm run seed:db
```
This will rollback any previous migrations made in your database, introduce new tables into the database using the migration files located in **./db/migrations** and also seed the database with data located in **./db/data/development-data**.

_**Caution**: Running this command again after setting up will remove any data that you have altered through the API and start again with just the seed data._

##### 5. Running the Development API
1. In the root directory, run the following command:
```bash
npm run dev
```
The following information should be shown in the terminal if successful:
```bash
[nodemon] 1.18.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node listen.js`
Listening on port 9090
```
##### 6. Navigating the Dev API

Once nodemon is running, open up chrome and navigate to the following address:

```
http://localhost:9090/api
```
This will give you a list of the available endpoints, which are also listed below. 
_**to make POST, PATCH and DELETE requests, you will likely need to use Postman**_

```js
{
  '/api': {
    GET: 'serving a list of endpoints and available methods',
  },
  '/api/topics': {
    GET: 'serving an array of topics objects',
    POST: 'add a new topic to the database. requires a \'slug\' and a \'description\'',
  },
  '/api/topics/:topic/articles': {
    GET: 'serving an array of article objects for a given topic',
    POST: 'add a new article to the database. requires a \'title\', \'body\' and a \'username\'',
  },
  '/api/articles': {
    GET: 'serving an array of articles objects',
  },
  '/api/articles/:article_id': {
    GET: 'serving an article object with a given article id',
    PATCH: 'update vote count of article. requires an ?inc_votes=<number> query',
    DELETE: 'delete an article',
  },
  '/api/articles/:article_id/comments': {
    GET: 'serving an array of comments objects with a given article id',
    POST: 'add a new comment to the article. requires a \'body\' and a \'username\'',
  },
  '/api/articles/:article_id/comments/:comment_id': {
    PATCH: 'update comments object requires an ?inc_votes=<number> query',
    DELETE: 'delete a comment',
  },
  '/api/users': {
    GET: 'serving an array of users objects',
  },
  '/api/users/:username': {
    GET: 'serving a user object with a given username',
  }
};
``` 

7. **Example Request**

    - Making a POST request in Postman to localhost:9090/api/articles/3/comments in Postman will add a new comment to the article with id of 3.
    - Check the list of valid usernames in ./db/data/development-data/users.js
    - The following body will need to be provided as JSON:

    ```json
    {
      "body": "this is a test comment",
      "username": "<username>"
    }
    ```
    - Upon a successful post request, the comment that has been added will be returned back as a response:
    ```json
      {
        "comment": {
          "comment_id": 302,
          "username": "<username>",
          "article_id": 3,
          "votes": 0,
          "created_at": "2019-01-18T12:33:57.337Z",
          "body": "this is a test comment"
        }
      }
    ```
To close Nodemon press CTRL+C in the terminal.

## Testing

Testing has been carried out using Mocha as the testing suite, Chai as the assertion library, and Supertest to make connections to the endpoints.

The test environment runs with a separate on a separate database to the development environment. To create the database, run the following command in the root directory:

```bash
psql -f ./db/test_setup.sql
```
Verify NC_Knews_Test is listed as a database by following the instructions in _'Installing and Running in local development environment', Section 3_.

Opening ./spec/app.spec.js, you will see that the migrations and seeding operations occur before each test due to the following:

```js
beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());
```
This will reseed the database before each test to make sure that changes to the database don't aftect the subsequent tests.


### End-to-end testing

The tests have been developed to test both a successful outcome from accessing an endpoint and the error handling if a request contains errors. 

**A full list of the tests performed on the endpoints and the results of those tests are located in ./results.md**

The tests are laid out within describe blocks. With the block containing all the tests that pertain to a particular endpoint. e.g. the following will contain all tests for the /api endpoint and /api/topics nested within it.
```js
describe('/api', => {
  // tests for /api endpoint here
  describe('/topics', () => {
  // tests for /api/topics in here
  });
});

```

- An example of a successful 200 request:
```js
it('GET request status:200 responds with array of objects, each containing slug and description', () => {
  return request
    .get('/api/topics')
    .expect(200)
    .then(({ body }) => {
      expect(body.topics[0]).to.have.keys('slug', 'description');
      expect(body.topics[1]).to.have.keys('slug', 'description');
    });
});
```
- An example of the error we expect to receive if the API request contains an error:
```js
it('POST status 400 error when passed a malformed body', () => {
  const postBody = {
    animal: 'Giraffe',
  };
  return request
    .post('/api/topics')
    .send(postBody)
    .expect(400);
});
```

- To run the spec file from the terminal, in the root directory, run the following command:

```bash
npm test
```

- Outputted in the terminal will be a results from the test file:
```bash
  /api
    ✓ GET status 200 responds with JSON describing all available endpoints in API
    /topics
      ✓ GET request status:200 responds with array of objects, each containing slug and description
      ✓ POST request status: 201 responds with the new object that was added
      ✓ POST status 400 error when passed a malformed body
      ✓ POST status 400 error when some keys are missing
      ✓ POST request status: 422 responds with error when unique id already exists in database
      ✓ INVALID REQUEST status 405 when doing patch, delete and put requests to specific ID
      /:topic/articles
        ✓ GET status 200 responds with articles for a given topic
        ✓ GET status 404 responds with err if request is in valid format but does not exist
        ✓ GET status 200 has a default limit of 10
        ✓ GET status 200 and can specify limit
<===================more tests==========================>
```
- To pipe this into a new file, use the following command:

```bash
npm test > <exampleresults>.md
```

### Coding style tests

This repo also runs a linting test, following a successful run of the spec file. ESLint has been used with an airbnb-base as the model. Following a successful output, the linter will output the results to the terminal. This indicates that there is one non-critical issue with the listen.js file:

```bash
/PATH/listen.js
  6:3  warning  Unexpected console statement  no-console

✖ 1 problem (0 errors, 1 warning)
```
If the linter finds any errors, the following will occur:

```bash
/PATH/BE2-NC-Knews/listen.js
  6:3  warning  Unexpected console statement  no-console

/PATH/BE2-NC-Knews/routes/api.js
  10:37  error  There should be no spaces inside this paren  space-in-parens

✖ 2 problems (1 error, 1 warning)
  1 error and 0 warnings potentially fixable with the `--fix` option.

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! BE2-NC-Knews@1.0.0 lint: `eslint ./`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the BE2-NC-Knews@1.0.0 lint script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/<user>.npm/_logs/2019-01-18T13_26_39_818Z-debug.log
npm ERR! Test failed.  See above for more details.
<user>-MacBook-Air:BE2-NC-Knews <user>
```



## Deployment

This app has been deployed on Heroku, so the following instructions will be for Heroku, also.

1. Sign up to Heroku on https://signup.heroku.com/
2. Install Heroku globally on your local machine using the following terminal command:
```bash
npm i -g heroku
```
3. In the root directory of the app log in to Heroku. The following command will make you open a browser to login to Heroku.
4. To create a new app, enter:
```bash
heroku create <app-name>
```
5. Push the app to heroku:
```bash
git push heroku master
```
6. In your user area of Heroku, the app should now be available. Click into it and add 'Heroku Postgres' as an add-on. This will act as the database for the application.
7. Click on the settings for the database and check these credentials against the output of the following terminal command:
```bash
heroku config:get DATABASE_URL
```
8. Verify that your knexfile.js has the production information, as in _Installing and Running in local development environment, Section 2_
9. Migrating and Seeding the Database.
- To create the tables for your database, run:
```bash
npm run migrate:rollback:prod
```
```bash
npm run migrate:latest:prod
```
- If you would like the database to be seeded with the dev-data, run:
```bash
npm run seed:prod
```
- Alternatively, create your own production seed, and alter the following path in **./db/data/index.js** to reference the location of your production data:
```js
const production = require('./<production-data-path>');
```
**see ./db/data/development-data for reference**


## Built With

* [Node](https://nodejs.org/en/) - JavaScript Runtime Environment
* [Express](https://expressjs.com/) - Web application framework
* [Knex](https://knexjs.org/) - SQL Query and Schema Builder
* [Mocha](https://knexjs.org/) - Testing Framework
* [Supertest](https://www.npmjs.com/package/supertest) - Package for testing HTTP requests
* [GitHub](https://github.com/) - Version Control

## Authors

* **Emma Randall** - [E-Randz](https://github.com/E-Randz)

## Acknowledgments

* Thank you to all the lovely people at Northcoders who helped throughout this project.