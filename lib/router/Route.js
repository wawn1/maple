const Path = require("./path");
const methods = require("methods");

class Route {
  constructor(path) {
    this.path = new Path(path, true);
    this.handlers = [];
    this.methodHandlers = new Map();
  }
  dispatch(req, res, out) {
    if (!this.path.match(req.path) || !this.methodHandlers.has(req.method)) {
      return out();
    }
    this.handlers = this.methodHandlers.get(req.method);
    let idx = 0,
      self = this;
    function next(err) {
      if (err) {
        return out(err); // 路由里出错,不处理,外部中间件处理
      }
      if (idx >= self.handlers.length) {
        return out();
      }
      let handler = self.handlers[idx++];
      handler(req, res, next);
    }
    next();
  }
}

methods.forEach(function (method) {
  Route.prototype[method] = function () {
    const preHandlers = this.methodHandlers.get(method) || [];
    this.methodHandlers.set(method, [...arguments, ...preHandlers]);
    return this;
  };
});

module.exports = Route;
