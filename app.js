const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./routers/users");
const homeRouter = require("./routers/home");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
// const { render } = require("ejs");

app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

// app.use(express.static("public")); // serve static files

// custom middleware example
// app.use((req, res, next) => {
//   req.user = {id:1, email:"hhh@gg.com"}
//   next()
// })

app.use(helmet());

// ejs and views use for server side rendering
app.set("view engine", "ejs");
app.set("views", "./views");

// middleware that redirect requests to the routes
app.use("/", homeRouter);
app.use("/api/users", userRouter);

// get the environment phase variable
// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log("NODE_ENV:", app.get("env"));
// $env: NODE_ENV="production"        run this code in cmd for change environment
if (app.get("env") == "development") {
  console.log("morgen is active");
  app.use(morgan("tiny"));
}

// example of using config middleware
// console.log("environment name:", config.get("name"));
// console.log("environment name:", config.get("version"));
// console.log("environment name:", config.get("sms"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server listening on port ${port}`));

// $env: PORT = 1366;
// set PORT=1366  //not work
