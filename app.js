const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const moment = require('moment');
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
  // SHOW ISSUES
  .get(async (req, res) => {
    const projectName = req.params.project;

    try {
      // Search project in the database and populate all issues
      const foundProject = await Project.findOne({
        name: projectName,
      })
        .populate('issues')
        .lean();
      // Save issues in a variable
      const issues = foundProject ? foundProject.issues : null;

      // Loop through issues to set relative time
      issues.forEach((e) => {
        e.created_on = moment(e.created_on).fromNow();
        e.updated_on = e.updated_on
          ? moment(e.updated_on).fromNow()
          : e.updated_on;
      });

      res.render('issues', {
        projectName,
        issues,
      });
    } catch (err) {
      if (err) throw err;
    }
  })

  // CREATE NEW ISSUE
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

// EDIT
app.get('/:project/issues/edit', async (req, res) => {
  const projectName = req.params.project;
  const { issueId } = req.query;

  try {
    // Find issue by id
    const issue = await Issue.findById(issueId);
    res.render('edit', { projectName, issue });
  } catch (err) {
    if (err) throw err;
  }
});

// UPDATE
app.post('/:project/issues/edit', async (req, res) => {
  const projectName = req.params.project;
  const { issueId } = req.query;
  const { issue } = req.body;

  // Add update date
  issue.updated_on = Date.now();

  // Handle open/close issue
  if (issue.open === 'open') {
    issue.open = true;
  } else {
    issue.open = false;
  }

  try {
    // Find issue by id and update
    await Issue.findByIdAndUpdate(issueId, issue, { useFindAndModify: false });
    res.redirect(`/${projectName}/issues`);
  } catch (err) {
    if (err) throw err;
  }
});

// DESTROY
app.get('/:project/issues/delete', async (req, res) => {
  const projectName = req.params.project;
  const { issueId } = req.query;

  try {
    // Find issue by id and remove
    await Issue.findByIdAndRemove(issueId, { useFindAndModify: false });
    res.redirect(`/${projectName}/issues`);
  } catch (err) {
    if (err) throw err;
  }
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
