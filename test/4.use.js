let maple = require("../lib/maple");

let app = maple();

app.use(function (req, res, next) {
  console.log("Ware1:", Date.now());
  next();
  //   next("Wrong");
});

app.get("/", function (req, res, next) {
  res.end("1");
});

const user = maple.Router();
user.use(function (req, res, next) {
  console.log("Ware2", Date.now());
  next();
});

user.get("/2", function (req, res, next) {
  res.end("2");
});

app.use("/user", user);

app.use(function (err, req, res, next) {
  console.log(err);
  next(err);
});
app.use(function (err, req, res, next) {
  res.end("catch " + err);
});

app.listen(3000, function () {
  console.log("server started at http://localhost:3000");
});
