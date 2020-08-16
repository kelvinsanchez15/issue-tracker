const express = require('express');
const moment = require('moment');
const Issue = require('../models/issue');
const Project = require('../models/project');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  // ======================
  // CREATE NEW ISSUE
  // ======================
  .post(async (req, res) => {
    const projectName = req.params.project;

    try {
      // Create new issue
      const newIssue = await Issue.create(req.body.issue);
      // Check if project exist in the database
      const foundProject = await Project.findOne({ name: projectName });
      // If no project is found create one
      if (!foundProject) {
        await Project.create({ name: projectName });
      }
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
  })

  // ======================
  // READ ISSUES
  // ======================
  .get(async (req, res) => {
    const projectName = req.params.project;
    let issues = null;

    try {
      // Search project in the database and populate all issues
      const foundProject = await Project.findOne({
        name: projectName,
      })
        .populate('issues')
        .lean();

      if (foundProject) {
        // If a project is found save issues in a variable
        issues = foundProject.issues;

        // Loop through issues to set relative time
        issues.forEach((e) => {
          e.created_on = moment(e.created_on).fromNow();
          e.updated_on = e.updated_on
            ? moment(e.updated_on).fromNow()
            : e.updated_on;
        });
      }

      res.render('issues', {
        projectName,
        issues,
      });
    } catch (err) {
      if (err) throw err;
    }
  });

// ======================
// UPDATE
// ======================
router.get('/new', async (req, res) => {
  const projectName = req.params.project;

  res.render('new', { projectName });
});

router.get('/edit', async (req, res) => {
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

router.post('/edit', async (req, res) => {
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

// ======================
// DESTROY
// ======================
router.get('/delete', async (req, res) => {
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

module.exports = router;
