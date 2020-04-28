const url = require("url");
module.exports = function (req, res, next) {
  const {pathname, query} = url.parse(req.url, true);
  req.path = pathname;
  req.query = query;
  req.method = req.method.toLowerCase();
  req.hostname = req.headers["host"].split(":")[0];
  res.json = function (obj) {
    res.setHeader("Content-Type", "application/json");
    const str = JSON.stringify(obj);
    res.end(str);
  };
  next();
};
