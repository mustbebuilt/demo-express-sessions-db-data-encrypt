const express = require("express");

const router = express.Router();

// for encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = app => {
  router.get("/example", (req, res) => {
    if (!req.session.login) {
      res.redirect("/login");
    } else {
      console.dir(req.session);
      return res.render("example", {
        title: "My EJS Example",
        firstname: "Hello EJS Template",
        surname: "My Heading Two"
      });
    }
  });
  router.get("/login", (req, res) => {
    return res.render("login");
  });

  router.post("/login", (req, res) => {
    // console.dir(req.body);
    let username = req.body.username;
    let password = req.body.password;
    //
    app
      .set("myDb")
      .collection("appUsers")
      .find({ name: username })
      .toArray(function(err, docs) {
        if (err) {
          console.error(err);
        }
        if (docs.length > 0) {
          ///////
          bcrypt.compare(req.body.password, docs[0].password, function(
            err,
            result
          ) {
            console.info(result);
            if (result == true) {
              req.session.login = true;
              res.redirect("/example");
            }
          });
        } else {
          res.redirect("/login");
        }
      });
  });

  router.get("/logout", (req, res) => {
    req.session.destroy(function(err) {
      res.redirect("/login");
    });
  });

  router.get("/signup", (req, res) => {
    return res.render("signup");
  });

  router.post("/signup", (req, res) => {
    // console.dir(req.body);
    let username = req.body.username;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      let hashedPwd = hash;
      let newUser = { name: username, password: hashedPwd };
      app
        .get("myDb")
        .collection("appUsers")
        .insertOne(newUser, function(err, dbResp) {
          if (err) {
            console.error(err);
          }
          if (dbResp.insertedCount === 1) {
            res.redirect("/login");
          } else {
            res.redirect("/login");
          }
        });
    });

    //
  });

  return router;
};
