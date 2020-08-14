const express = require('express');
const Issue = require('../models/issue');
const Project = require('../models/project');

const router = express.Router();

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
