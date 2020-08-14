const mongoose = require('mongoose');

// Schema setup
const issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  status_text: String,
  created_on: { type: Date, default: Date.now },
  updated_on: Date,
  open: { type: Boolean, default: true },
});

module.exports = mongoose.model('Issue', issueSchema);
