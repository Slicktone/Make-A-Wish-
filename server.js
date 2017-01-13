var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();
var port = 3000;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// starting the MethodOverride for the Delete Post
app.use(methodOverride("_method"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "wishes_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);

});

// Root get route
app.get("/", function(req, res) {

    connection.query("SELECT * FROM wishes;", function(err, data) {
      if (err) {
        res.sendStatus(400)
        throw err;
      }

      // Test it
      // console.log('The solution is: ', data);

      // Test it
      // res.send(data);

      res.render("index", {wishes: data });
    });
});


// Post route -> back to home
app.post("/create", function(req, res) {

    // Test it
    // console.log('You sent, ' + req.body.event);

    // Test it
    // res.send('You sent, ' + req.body.event);

  connection.query("INSERT INTO wishes (wish) VALUES (?)",
   [req.body.event], function(err, result) {
    if (err) {
        res.sendStatus(400)
        throw err;
    }

    res.redirect("/");
  });

});

// adding the Delete routes
app.delete("/:id", function(req, res) {
  connection.query("DELETE FROM wishes WHERE id = ?",
  [req.params.id], function(err, result) {
    if (err) {
      res.sendStatus(400)
      throw err;
    }

    res.redirect("/");
  });
});

app.put("/", function(req, res) {
  connection.query("UPDATE wishes SET wish = ? WHERE id = ?",
  [req.body.wish, req.body.id], function(err, result) {
    if (err) {
      res.sendStatus(400)
      throw err;
    }

    res.redirect("/");
  });
});

app.listen(port);
