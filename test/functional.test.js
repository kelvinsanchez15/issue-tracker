const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Project = require('../models/project');
const Issue = require('../models/issue');

const { assert } = chai;

chai.use(chaiHttp);

beforeEach('descripcion', async () => {
  await Project.deleteMany();
  await Issue.deleteMany();
});

describe('Functional Tests', () => {
  describe('POST /api/issues/{project} => object with issue data', () => {
    // it('Every field filled in', async () => {
    //   const res = await chai.request(app).post('/apitest/issues').send({
    //     issue_title: 'Title',
    //     issue_text: 'text',
    //     created_by: 'Functional Test - Every field filled in',
    //     assigned_to: 'Chai and Mocha',
    //     status_text: 'In QA',
    //   });

    //   assert(res).to.have.status(200);
    // });

    it('Required fields filled in');
    it('Missing required fields');
  });

  describe('PUT /api/issues/{project} => text', () => {
    it('No body');
    it('One field to update');
    it('Multiple fields to update');
  });

  describe('GET /api/issues/{project} => Array of objects with issue data', () => {
    it('No filter');
    it('One filter');
    it('Multiple filters');
  });

  describe('DELETE /api/issues/{project} => text', () => {
    it('No _id');
    it('Valid _id');
  });
});
