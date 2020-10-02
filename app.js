const express = require("express");
// add path
const path = require("path");

const app = express();

// for post on form
app.use(express.urlencoded({ extended: false }));

// switch cookie parser on
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// sessions
const session = require("express-session");
// connect-mongo to store session in the db
const MongoStore = require("connect-mongo")(session);

// Basic usage
app.use(
  session({
    secret: "someTopSecret",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      url: "mongodb://localhost:27017/myTestSession"
    })
  })
);

const routes = require("./routes/routes");

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("./public"));

app.use("/", routes(app));

// remove for sample files
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Database

var MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb://localhost:27017",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, client) {
    app.set("myDb", client.db("myTest"));
  }
);

app.listen(3000);

console.log("Express on 3000");

module.exports = app;
