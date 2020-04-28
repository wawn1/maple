let maple = require("../lib/maple");

let app = maple();

app
  .get(
    "/",
    function (req, res, next) {
      console.log(1);
      next();
    },
    function (req, res, next) {
      console.log(11);
      next();
    }
  )
  .get("/", function (req, res, next) {
    console.log(2);
    next();
  })
  .get("/", function (req, res, next) {
    console.log(3);
    res.end("ok");
  });
app.listen(3000, function () {
  console.log("server started at http://localhost:3000");
});
