const mongoose = require('mongoose');

// Schema setup
const Project = mongoose.model('Project', {
  name: { type: String, required: true, trim: true },
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
});

module.exports = Project;
