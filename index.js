const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sequelize = require("./src/models/index");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());


// Initialize Sequelize
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => console.error("Error syncing database", error));

// Routes setup
const routes = require("./src/routes/routes");
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
