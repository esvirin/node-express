const express = require("express");
const app = express();
const mysql = require("mysql2");
const dbconn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

app.use(express.static("public"));

app.set("view engine", "pug");

app.listen(3000, function () {
  console.log("express listen 3000");
});

app.get("/", function (req, res) {
  let currentResult = new Object();
  dbconn.query("SELECT * FROM `goods`", function (err, result) {
    if (err) {
      throw err;
    }
    for (let i in result) {
      currentResult[result[i]["id"]] = result[i];
    }

    res.render("main", {
      myPugint: new Date().toLocaleString("ru"),
      myDB: JSON.parse(JSON.stringify(currentResult)),
    });
  });
});

app.get("/cat", function (req, res) {
  console.log(req.query.id);
  let catId = req.query.id;

  let category = new Promise(function (resolve, reject) {
    dbconn.query(
      `SELECT * FROM market.category WHERE id=${catId};`,
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });

  let goods = new Promise(function (resolve, reject) {
    dbconn.query(
      `SELECT * FROM market.goods WHERE category=${catId};`,
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });

  Promise.all([category, goods]).then(function (data) {
    console.log(JSON.parse(JSON.stringify(data)));
    res.render("cat", {
      DBdata: JSON.parse(JSON.stringify(data)),
    });
  });
});
