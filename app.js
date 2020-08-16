const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Routes
const routes = require('./routes/routes');
// Test runner
// const runner = require('./test-runner');

const app = express();

// Prevent sniff and XSS attacks. PD: CSP disable to avoid inline script error
app.use(helmet({ contentSecurityPolicy: false }));

// Body parser
app.use(express.urlencoded({ extended: true }));

// Cors used for FCC testing purposes
app.use(cors({ origin: '*' }));

// Connection to the database and error handling
const url = process.env.DB_URI || 'mongodb://127.0.0.1:27017/issueTrackerDB';
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

mongoose.connection.on('error', (error) => console.log(error));

// Serving styles and scripts from public dir
app.use(express.static('public'));
// Set view engine
app.set('view engine', 'pug');

// Main route defined
app.get('/', (req, res) =>
  res.render('index', {
    title: 'Issue Tracker',
    message: 'Here is going to be user stories and project explanation',
  })
);

// Routing for API
app.use('/:project/issues', routes);

// Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
  // if (process.env.NODE_ENV === 'test') {
  //   console.log('Running Tests...');
  //   setTimeout(() => {
  //     try {
  //       runner.run();
  //     } catch (err) {
  //       console.log('Tests are not valid:');
  //       console.log(err);
  //     }
  //   }, 1500);
  // }
});

module.exports = app; // for testing
