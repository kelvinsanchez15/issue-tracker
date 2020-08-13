const Issue = require("../models/issue");
const Project = require("../models/project");

const expect = require("chai").expect;
// const MongoClient = require("mongodb");
// const ObjectId = require("mongodb").ObjectID;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      const project = req.params.project;
    })

    .post(function (req, res) {
      const project = req.params.project;
    })

    .put(function (req, res) {
      const project = req.params.project;
    })

    .delete(function (req, res) {
      const project = req.params.project;
    });
};
