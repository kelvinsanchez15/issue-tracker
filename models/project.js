const mongoose = require("mongoose");

// Schema setup
const projectSchema = new mongoose.Schema({
  name: String,
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
});

module.exports = mongoose.model("Project", projectSchema);
