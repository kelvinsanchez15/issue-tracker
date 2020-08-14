const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Routes
const apiRoutes = require('./routes/routes');
// Test runner
// const runner = require('./test-runner');
const Project = require('./models/project');
const Issue = require('./models/issue');

const app = express();

// Prevent sniff and XSS attacks. PD: CSP disable to avoid inline script error
app.use(helmet({ contentSecurityPolicy: false }));

// Body parser
app.use(express.urlencoded({ extended: true }));

// Cors used for FCC testing purposes
app.use(cors({ origin: '*' }));

// Connection to the database and error handling
mongoose
  .connect(process.env.DB_URI, {
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

//
app
  .route('/:project/issues')
  // GET render all issues by project
  .get(async (req, res) => {
    const projectName = req.params.project;

    try {
      // Search project in the database and populate all issues
      const foundProject = await Project.findOne({
        name: projectName,
      }).populate('issues');
      // Save issues in a variable
      const issues = foundProject ? foundProject.issues : null;

      res.render('issues', {
        projectName,
        issues,
      });
    } catch (err) {
      if (err) throw err;
    }
  })

  // POST new issue
  .post(async (req, res) => {
    const projectName = req.params.project;

    try {
      // Create new issue
      const newIssue = await Issue.create(req.body.issue);
      // Find project by name and push new issue
      await Project.findOneAndUpdate(
        { name: projectName },
        { $push: { issues: newIssue } },
        { new: true, useFindAndModify: false }
      );
      res.redirect(`/${projectName}/issues`);
    } catch (err) {
      res.redirect(`/${projectName}/issues/new`);
      throw err;
    }
  });

// GET render new issue page
app.get('/:project/issues/new', async (req, res) => {
  const projectName = req.params.project;

  res.render('new', { projectName });
});

// Routing for API
app.use('/', apiRoutes);

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
