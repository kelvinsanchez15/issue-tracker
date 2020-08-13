const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Prevent sniff and XSS attacks. PD: CSP disable to avoid inline script error
app.use(helmet({ contentSecurityPolicy: false }));

// Routes
const apiRoutes = require("./routes/api.js");

// Test runner
const runner = require("./test-runner");

// Body parser
app.use(express.urlencoded({ extended: true }));

// Cors used for FCC testing purposes
app.use(cors({ origin: "*" }));

// Connection to the database and error handling
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

mongoose.connection.on("error", (error) => console.log(error));

// Serving styles and scripts from public dir
app.use(express.static("public"));

// Main route defined
app.get("/", (req, res) => res.sendFile(`${__dirname}/views/`));

//Sample front-end
app
  .route("/:project/")
  .get((req, res) => res.sendFile(`${__dirname}/views/issue.html`));

//Routing for API
apiRoutes(app);

// Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ` + port);
  // if (process.env.NODE_ENV === "test") {
  //   console.log("Running Tests...");
  //   setTimeout(() => {
  //     try {
  //       runner.run();
  //     } catch (err) {
  //       console.log("Tests are not valid:");
  //       console.log(err);
  //     }
  //   }, 1500);
  // }
});

module.exports = app; //for testing
