const express = require('express');
// const Issue = require('../models/issue');
// const Project = require('../models/project');

const router = express.Router();

// Dummy data
// const dummyIssueData = [
//   {
//     issue_title: 'Pressing ALT + F4 does not solve my problem',
//     issue_text:
//       'I was watching a stream and my connection was failing, they suggested in the chat to press ALT + F4 to solve my problem, when I did it, everything closed.',
//     created_by: 'ComputerNewbie',
//   },
//   {
//     issue_title: 'Another Issue',
//     issue_text: 'This is a issue text description',
//     created_by: 'Someone',
//   },
//   {
//     issue_title: 'Another Issue 2',
//     issue_text: 'This is a issue text description2',
//     created_by: 'Someone2',
//   },
// ];

// Create project
// const createTestProject = async () => {
//   const testProject = await Project.create({ name: 'apitest' });
//   console.log(testProject);
// };

// createTestProject();

// Create issue
// const createTestIssue = async () => {
//   // Create Issue
//   const testIssue = await Issue.create(dummyIssueData[2]);
//   console.log(testIssue);
//   // Find project by name and push new issue
//   const foundProject = await Project.findOneAndUpdate(
//     { name: 'apitest' },
//     { $push: { issues: testIssue } },
//     { new: true, useFindAndModify: false }
//   );
//   console.log(foundProject);
// };

// createTestIssue();

// Find by project name and populate issues
// const findByNameAndPopulate = async () => {
//   const foundProject = await Project.findOne({ name: 'apitest' }).populate(
//     'issues'
//   );
//   console.log(foundProject);
// };

// findByNameAndPopulate();

router
  .route('/api/issues/:project')

  .get((req, res) => {
    const { project } = req.params;
    console.log(project);
  })

  .post((req, res) => {
    const { project } = req.params;
  })

  .put((req, res) => {
    const { project } = req.params;
  })

  .delete((req, res) => {
    const { project } = req.params;
  });

module.exports = router;
