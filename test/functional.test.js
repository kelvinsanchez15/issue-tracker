/* eslint-disable no-underscore-dangle */
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app');
const Project = require('../models/project');
const Issue = require('../models/issue');

const { expect } = chai;

chai.use(chaiHttp);

const mockIssue1 = {
  issue_title: 'title1',
  issue_text: 'text1',
  created_by: 'someone1',
  assigned_to: 'assigned1',
  status_text: 'status1',
};

const mockIssue2 = {
  issue_title: 'title2',
  issue_text: 'text2',
  created_by: 'someone2',
  assigned_to: 'assigned2',
  status_text: 'status2',
};

const mockIssue3 = {
  issue_title: 'title3',
  issue_text: 'text3',
  created_by: 'someone3',
  assigned_to: 'assigned3',
  status_text: 'status3',
};

before('Clean DB and create mock issues before tests', async () => {
  await Project.deleteMany();
  await Issue.deleteMany();

  const issues = await Issue.create([mockIssue1, mockIssue2, mockIssue3]);

  await Project.findOneAndUpdate(
    { name: 'apitest2' },
    { $push: { issues } },
    { upsert: true, useFindAndModify: false }
  );
});

after('Disconnect DB after all tests', () => {
  mongoose.connection.close();
});

describe('Functional Tests', () => {
  // ======================
  // CREATE NEW ISSUE TESTS
  // ======================
  describe('POST /{project}/issues/ => object with issue data', () => {
    it('Every field filled in', async () => {
      const response = await chai
        .request(app)
        .post('/apitest/issues')
        .send({
          issue: {
            issue_title: 'Functional Test - Every field filled in',
            issue_text: 'text',
            created_by: 'tester',
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA',
          },
        });

      expect(response).to.have.status(200);

      const issue = await Issue.findOne({
        issue_title: 'Functional Test - Every field filled in',
      }).lean();

      expect(issue).to.be.an('object');
      expect(issue).to.include({
        issue_title: 'Functional Test - Every field filled in',
        issue_text: 'text',
        created_by: 'tester',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA',
      });
    });

    it('Required fields filled in', async () => {
      const response = await chai
        .request(app)
        .post('/apitest/issues')
        .send({
          issue: {
            issue_title: 'Functional Test - Required fields filled in',
            issue_text: 'text',
            created_by: 'tester',
          },
        });

      expect(response).to.have.status(200);

      const issue = await Issue.findOne({
        issue_title: 'Functional Test - Required fields filled in',
      }).lean();

      expect(issue).to.be.an('object');
      expect(issue).to.include({
        issue_title: 'Functional Test - Required fields filled in',
        issue_text: 'text',
        created_by: 'tester',
      });
    });

    it('Missing required fields', async () => {
      const response = await chai
        .request(app)
        .post('/apitest/issues')
        .send({
          issue: {
            issue_text: 'Functional Test - Missing required fields',
            created_by: 'tester',
          },
        });

      expect(response).to.have.status(400);
    });
  });

  // ======================
  // READ ISSUES TESTS
  // ======================
  describe('GET /{project}/issues/ => Array of objects with issue data', () => {
    it('No filter', async () => {
      const response = await chai
        .request(app)
        .get('/apitest2/issues')
        .query({});

      expect(response).to.have.status(200);

      const project = await Project.findOne({ name: 'apitest2' })
        .populate({ path: 'issues' })
        .lean();

      expect(project.issues).to.be.an('array');
      expect(project.issues[0]).to.include(mockIssue1);
      expect(project.issues[1]).to.include(mockIssue2);
      expect(project.issues[2]).to.include(mockIssue3);
    });

    it('One filter', async () => {
      const response = await chai
        .request(app)
        .get('/apitest2/issues')
        .query({ author: 'someone2' });

      expect(response).to.have.status(200);

      const project = await Project.findOne({ name: 'apitest2' })
        .populate({
          path: 'issues',
          match: { created_by: 'someone2' },
        })
        .lean();

      expect(project.issues).to.be.an('array');
      expect(project.issues[0]).to.include(mockIssue2);
    });

    it('Multiple filters', async () => {
      const response = await chai
        .request(app)
        .get('/apitest2/issues')
        .query({ assigned: 'assigned3', open: 'true' });

      expect(response).to.have.status(200);

      const project = await Project.findOne({ name: 'apitest2' })
        .populate({
          path: 'issues',
          match: { assigned_to: 'assigned3', open: 'true' },
        })
        .lean();

      expect(project.issues).to.be.an('array');
      expect(project.issues[0]).to.include(mockIssue3);
    });
  });

  // ======================
  // UPDATE ISSUE TESTS
  // ======================
  describe('POST /{project}/issues/edit => updated object', () => {
    it('No body', async () => {
      const project = await Project.findOne({ name: 'apitest2' })
        .populate({ path: 'issues' })
        .lean();

      const issueId = project.issues[0]._id;

      const issueUpdate = {};

      const updatedIssue = await Issue.findByIdAndUpdate(issueId, issueUpdate, {
        new: true,
        useFindAndModify: false,
      });

      expect(updatedIssue).to.be.an('object');
      expect(updatedIssue).to.include(mockIssue1);
    });

    it('One field to update', async () => {
      const project = await Project.findOne({ name: 'apitest2' })
        .populate({ path: 'issues' })
        .lean();

      const issueId = project.issues[0]._id;

      const issueUpdate = { created_by: 'updated author' };

      const updatedIssue = await Issue.findByIdAndUpdate(issueId, issueUpdate, {
        new: true,
        useFindAndModify: false,
      });

      expect(updatedIssue).to.be.an('object');
      expect(updatedIssue).to.include(issueUpdate);
    });

    it('Multiple fields to update', async () => {
      const project = await Project.findOne({ name: 'apitest2' })
        .populate({ path: 'issues' })
        .lean();

      const issueId = project.issues[0]._id;

      const issueUpdate = mockIssue3;

      const updatedIssue = await Issue.findByIdAndUpdate(issueId, issueUpdate, {
        new: true,
        useFindAndModify: false,
      });

      expect(updatedIssue).to.be.an('object');
      expect(updatedIssue).to.include(mockIssue3);
    });
  });

  // ======================
  // DELETE ISSUE TEST
  // ======================
  describe('POST /{project}/issues/delete => deleted object', () => {
    it('Valid _id', async () => {
      const project = await Project.findOne({ name: 'apitest2' })
        .populate({ path: 'issues' })
        .lean();

      const issueId = project.issues[0]._id;

      const deletedIssue = await Issue.findByIdAndRemove(issueId, {
        new: true,
        useFindAndModify: false,
      });

      expect(deletedIssue).to.be.an('object');
      expect(deletedIssue).to.include(mockIssue3);
    });
  });
});
