# Quality Assurance Project #2: Issue Tracker.

## View project

[Issue Tracker](https://issue-tracker-kel.glitch.me/)

## User Stories

1. Prevent cross site scripting (XSS) attacks.
2. I can POST <code>/api/{projectname}/issues/</code> with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
3. The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), open(boolean, true for open, false for closed), and \_id.
4. I can PUT <code>/api/{projectname}/issues/</code> with a \_id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+ \_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
5. I can DELETE <code>/api/{projectname}/issues/</code> with a \_id to completely delete an issue. If no \_id is sent return 'id error', success: 'deleted '+ \_id, failed: 'could not delete '+ \_id.
6. I can GET <code>/api/{projectname}/issues/</code> for an array of all issues on that specific project with all the information for each issue as was returned when posted.
7. I can filter my get request by also passing along any field and value in the query(ie. <code>/api/{projectname}/issues/?open=false)</code>. I can pass along as many fields/values as I want.
8. All 11 functional tests are complete and passing.

## Additional Dependencies

- [Chai](https://www.npmjs.com/package/chai).
- [Chai-http](https://www.npmjs.com/package/chai-http).
- [CORS](https://www.npmjs.com/package/cors).
- [Dotenv](https://www.npmjs.com/package/dotenv).
- [Express](https://www.npmjs.com/package/express).
- [Helmet](https://www.npmjs.com/package/helmet).
- [Mocha](https://www.npmjs.com/package/mocha).
- [Moment](https://www.npmjs.com/package/moment).
- [MongoDB](https://www.npmjs.com/package/mongodb).
- [Mongoose](https://www.npmjs.com/package/mongoose).
- [Pug](https://www.npmjs.com/package/pug).
