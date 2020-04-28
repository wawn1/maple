const Router = require("./router");
const http = require("http");
const methods = require("methods");
const slice = Array.prototype.slice;

function Application() {
  this.settings = {}; // key: val
  this.engines = {}; // 后缀名: render函数
}

Application.prototype.lazyrouter = function () {
  if (!this._router) {
    this._router = new Router();
  }
};
Application.prototype.set = function (key, val) {
  if (arguments.length == 1) {
    return this.settings[key];
  }
  this.settings[key] = val;
};

Application.prototype.engine = function (ext, render) {
  let extension = ext[0] === "." ? ext : "." + ext;
  this.engines[extension] = render;
};

// app.[method] 相当于router.[method]  url完全匹配
methods.forEach(function (method) {
  Application.prototype[method] = function () {
    if (method === "get" && arguments.length === 1) {
      return this.set(arguments[0]);
    }
    this.lazyrouter();
    this._router[method].apply(this._router, slice.call(arguments));
    return this;
  };
});
Application.prototype.route = function (path) {
  this.lazyrouter();
  return this._router.route(path);
};
// app.use 相当于router.use  use是前缀匹配
Application.prototype.use = function () {
  this.lazyrouter();
  this._router.use.apply(this._router, arguments);
};
Application.prototype.listen = function () {
  let self = this;
  const server = http.createServer(function (req, res) {
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`);
    }
    self._router.handle(req, res, done);
  });
  server.listen(...arguments);
};
module.exports = Application;
