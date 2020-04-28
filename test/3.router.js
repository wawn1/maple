let maple = require("../lib/maple");

let app = maple();

app
  .route("/user")
  .get(function (req, res) {
    res.end("get");
  })
  .post(function (req, res) {
    res.end("post");
  })
  .put(function (req, res) {
    res.end("put");
  })
  .delete(function (req, res) {
    res.end("delete");
  });
app.listen(3000, function () {
  console.log("server started at http://localhost:3000");
});
