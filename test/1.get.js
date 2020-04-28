// let express = require("express");
let maple = require("../lib/maple");

let app = maple();

// get 里可以放多个，next 顺次执行，和外部构成一根链条，next一旦忘了，后面都不会执行了
app.get(
  "/",
  function (req, res, next) {
    console.log("start 1");
    next();
    // next();
  },
  function (req, res, next) {
    console.log("start 2");
    // next();
  }
);
app.use(function (req, res, next) {
  console.log("app use");
  next();
});

app.get("/", function (req, res, next) {
  console.log("start 3");
  res.end("end");
});

app.listen(3000, function () {
  console.log("server started at http://localhost:3000");
});
