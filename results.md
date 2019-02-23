
> NC_News@1.0.0 test /Users/emma/Documents/northcoders/BACK-END-02/BE2-NC-Knews
> mocha ./spec/*.spec.js



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
        ✓ GET status 200 returns article count with the array of articles
        ✓ GET status 404 responds with err if request is in valid format but does not exist
        ✓ GET status 200 has a default limit of 10
        ✓ GET status 200 and can specify limit
        ✓ GET status 400 if malformed p or limit
        ✓ GET status 200 defaults to sort_by created_at column and descending order
        ✓ GET status 200 can specify sort_by and order
        ✓ GET status 200 ignores invalid sort by and order queries
        ✓ GET status 200 returns results default offset of 0 pages
        ✓ GET status 200 returns results offset by page number
        ✓ GET status 200 ignores other queries that aren't valid
        ✓ POST status 201 accepts an object containing title, body and username and sends back article that has been added
        ✓ POST status 400 if unable to post due to the body not having the correct keys
        ✓ POST status 400 if unable to post due to the body missing some keys
        ✓ POST status 404 if unable to post due to the topic not existing
        ✓ POST status 400 if trying to post empty object
        ✓ POST status 404 if unable to post due to the username not existing
        ✓ INVALID REQUEST status 405 when doing patch, delete and put requests to specific ID
    /articles
      ✓ GET status 200 responds with articles containing the correct keys
      ✓ GET status 200 has a default limit of 10
      ✓ GET status 200 and can specify limit
      ✓ GET status 200 defaults to sort_by created_at column and descending order
      ✓ GET status 200 can specify sort_by and order
      ✓ GET status 200 ignores invalid sort by and order queries
      ✓ GET status 200 returns results default offset of 0 pages
      ✓ GET status 200 returns results offset by page number
      ✓ GET status 200 returns article count with the array of articles
      ✓ GET status 400 if limit and p queries are invalid
      ✓ INVALID REQUEST status 405 when doing patch, delete and put requests to specific ID
      /:article_id
        ✓ GET request status 200 sends one article object when passed a valid id
        ✓ GET request status 404 sends error if article id is valid but does not exist in database
        ✓ GET request status 400 sends error if article id is in an invalid format
        ✓ PATCH request status 200 responds with article that has been updated with vote count increased
        ✓ PATCH request status 200 responds with article that has been updated with vote count decreased
        ✓ PATCH request status 400 if inc_votes query is invalid
        ✓ PATCH request status 200 returns unmodified body if no vote is passed
        ✓ PATCH request status 404 responds with error if the article ID does not exist
        ✓ DELETE request status 204 and no content responds when valid article id is specified
        ✓ DELETE request status 404 when delete request to valid id format but does not exist in database
        ✓ DELETE request status 400 when delete request to invalid format but does not exist in database
        ✓ INVALID REQUEST status 405 when doing post and put requests to specific ID
        /comments
          ✓ GET request status 200 responds with array of comments for the given article id
          ✓ GET request status 404 responds when passed valid article id but article does not exist
          ✓ GET request status 400 responds with invalid article id
          ✓ GET status 200 has a default limit of 10
          ✓ GET status 200 and can specify limit
          ✓ GET status 200 defaults to sort_by created_at column and descending order
          ✓ GET status 200 can specify sort_by and order
          ✓ GET status 200 returns results default offset of 0 pages
          ✓ GET status 200 returns results offset by page number
          ✓ GET status 200 ignores other queries that aren't valid
          ✓ POST request status 201 accepts a username and body and returns the newly added comment
          ✓ POST status 400 if unable to post due to the body not having the correct keys
          ✓ POST status 404 if unable to post due to the article not existing
          ✓ POST status 404 if unable to post due to the username not existing
          ✓ INVALID REQUEST status 405 when doing patch, delete and put requests to specific ID
          /:comment_id
            ✓ PATCH request status 200 responds with comment that has been updated with vote count increased
            ✓ PATCH request status 200 responds with article that has been updated with vote count decreased
            ✓ PATCH request status 400 if inc_votes is not a number
            ✓ PATCH request status 200 if no body is sent
            ✓ PATCH request status 404 responds with error if the article ID does not exist
            ✓ PATCH request status 404 responds with error if the comment ID does not exist
            ✓ DELETE request status 204 and no content responds when valid article id is specified
            ✓ DELETE request status 404 when article_id exists but comment_id does not
            ✓ DELETE request status 404 when article_id does not exist
            ✓ DELETE request status 400 when delete request to invalid format
            ✓ INVALID REQUEST status 405 when doing get, post and put requests to specific ID
    /users
      ✓ GET status 200 responds with array of user objects
      ✓ INVALID REQUEST status 405 when doing patch, put and delete requests to specific ID
      /:username
        ✓ GET status 200 responds with object containing correct user
        ✓ GET status 404 responds with error if username in valid syntax but does not exist
        ✓ INVALID REQUEST status 405 when doing patch, put and delete requests to specific ID
        /articles
          ✓ fetches all article for a given username
          ✓ GET status 404 responds with error if username in valid syntax but does not exist


  82 passing (12s)


> NC_News@1.0.0 posttest /Users/emma/Documents/northcoders/BACK-END-02/BE2-NC-Knews
> npm run lint


> NC_News@1.0.0 lint /Users/emma/Documents/northcoders/BACK-END-02/BE2-NC-Knews
> eslint ./


/Users/emma/Documents/northcoders/BACK-END-02/BE2-NC-Knews/listen.js
  6:3  warning  Unexpected console statement  no-console

✖ 1 problem (0 errors, 1 warning)

