const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
});

module.exports = mongoose.model('Project', projectSchema);
