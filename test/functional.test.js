const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app');
const Project = require('../models/project');
const Issue = require('../models/issue');

const { expect } = chai;

chai.use(chaiHttp);

beforeEach('Clean DB before each test', async () => {
  await Project.deleteMany();
  await Issue.deleteMany();
});

after('Disconnect DB after all tests', () => {
  mongoose.connection.close();
});

describe('Functional Tests', () => {
  // CREATE
  describe('POST /{project}/issues/ => object with issue data', () => {
    it('Every field filled in', async () => {
      const response = await chai
        .request(app)
        .post('/apitest/issues')
        .send({
          issue: {
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in',
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA',
          },
        });
      expect(response).to.have.status(200);
      const issue = await Issue.findOne({}).lean();
      expect(issue).to.include.all.keys(
        'issue_title',
        'issue_text',
        'created_by',
        'assigned_to',
        'status_text'
      );
    });

    it('Required fields filled in', async () => {
      const response = await chai
        .request(app)
        .post('/apitest/issues')
        .send({
          issue: {
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in',
          },
        });
      expect(response).to.have.status(200);
      const issue = await Issue.findOne({}).lean();
      expect(issue).to.include.all.keys(
        'issue_title',
        'issue_text',
        'created_by'
      );
    });

    it('Missing required fields', async () => {
      const response = await chai
        .request(app)
        .post('/apitest/issues')
        .send({
          issue: {
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in',
          },
        });
      expect(response).to.have.status(400);
    });
  });

  // READ
  describe('GET /{project}/issues/ => Array of objects with issue data', () => {
    it('No filter', async () => {
      const response = await chai.request(app).get('/apitest/issues');

      expect(response).to.have.status(200);
    });

    it('One filter');

    it('Multiple filters');
  });

  // UPDATE
  describe('POST /{project}/issues/edit => text', () => {
    it('No body');
    it('One field to update');
    it('Multiple fields to update');
  });

  // DELETE
  describe('POST /{project}/issues/delete => text', () => {
    it('No _id');
    it('Valid _id');
  });
});
