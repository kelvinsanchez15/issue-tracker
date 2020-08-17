const mongoose = require('mongoose');

const Issue = mongoose.model('Issue', {
  issue_title: { type: String, required: true, trim: true },
  issue_text: { type: String, required: true, trim: true },
  created_by: { type: String, required: true, trim: true },
  assigned_to: { type: String, trim: true },
  status_text: { type: String, trim: true },
  created_on: { type: Date, default: Date.now },
  updated_on: Date,
  open: { type: Boolean, default: true },
});

module.exports = Issue;
