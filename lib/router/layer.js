const Path = require("./path");

class Layer {
  constructor(handler) {
    this.handler = handler;
  }
  handle_request(req, res, next) {
    if (this.handler.length !== 3) {
      return next();
    }
    this.handler(req, res, next);
  }
  handle_error(err, req, res, next) {
    if (this.handler.length !== 4) {
      return next(err);
    }
    this.handler(err, req, res, next);
  }
}

class RouteLayer extends Layer {
  constructor(route) {
    super(route.dispatch.bind(route));
    this.route = route;
  }
}

class MiddleLayer extends Layer {
  constructor(path, handler) {
    super(handler);
    this.path = new Path(path, false);
  }
}

module.exports = {
  Layer,
  RouteLayer,
  MiddleLayer,
};
