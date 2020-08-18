const express = require('express');
const moment = require('moment');
const Issue = require('../models/issue');
const Project = require('../models/project');

const router = express.Router({ mergeParams: true });

// ======================
// CREATE NEW ISSUE
// ======================
router.get('/new', async (req, res) => {
  const projectName = req.params.project;

  res.render('new', { projectName });
});

router
  .route('/')
  .post(async (req, res) => {
    const projectName = req.params.project;
    const issue = new Issue(req.body.issue);

    try {
      await issue.save();
    } catch (err) {
      return res.status(400).send(err);
    }

    try {
      // Check if project exist in the database
      const foundProject = await Project.findOne({ name: projectName });
      // If no project is found create one
      if (!foundProject) {
        await Project.create({ name: projectName });
      }
      // Find project by name and push new issue
      await Project.findOneAndUpdate(
        { name: projectName },
        { $push: { issues: issue } },
        { new: true, useFindAndModify: false }
      );
      return res.status(201).redirect(`/${projectName}/issues`);
    } catch (err) {
      return res.status(400).send(err);
    }
  })

  // ======================
  // READ ISSUES
  // ======================
  .get(async (req, res) => {
    const projectName = req.params.project;
    let issues = null;

    // Filter
    const match = {
      // GET /issues?id=5f3a710fed618c093c160d11
      ...(req.query.id && { _id: req.query.id }),
      // GET /issues?author=kelvin123
      ...(req.query.author && { created_by: req.query.author }),
      // GET /issues?assigned=mathew159
      ...(req.query.assigned && { assigned_to: req.query.assigned }),
      // GET /issues?status=help%please
      ...(req.query.status && { status_text: req.query.status }),
      // GET /issues?open=false
      ...(req.query.open && { open: req.query.open === 'true' }),
    };

    // Sorter
    const sort = {};

    // GET /issues?sort=created_on:desc || GET /issues?sort=updated_on:desc
    if (req.query.sort) {
      const parts = req.query.sort.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
      // Search project in the database and populate all issues
      const foundProject = await Project.findOne({
        name: projectName,
      })
        .populate({
          path: 'issues',
          match,
          options: {
            limit: req.query.limit,
            sort,
          },
        })
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
          e.closed_on = e.closed_on
            ? moment(e.closed_on).fromNow()
            : e.closed_on;
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
    issue.closed_on = Date.now();
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
