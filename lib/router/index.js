const Route = require("./Route");
const {RouteLayer, MiddleLayer} = require("./layer");
const methods = require("methods");
const url = require("url");
const init = require("../middle/init");

class Router {
  constructor() {
    this.layers = [];
    this.use(init);
  }
  route(path, layers = this.layers) {
    let route = new Route(path);
    let layer = new RouteLayer(route);
    layers.push(layer);
    return route;
  }
  /**  不只有路由layer还有
   * 1.处理中间件
   * 2. 处理子路由容器
   */
  handle(req, res, out) {
    let {pathname} = url.parse(req.url, true);
    let idx = 0,
      self = this,
      removed = "";
    function next(err) {
      if (removed.length > 0) {
        req.url = removed + req.url;
        removed = "";
      }
      if (idx >= self.layers.length) return out();

      let layer = self.layers[idx++];
      if (layer.route) {
        // 路由
        if (!err) {
          layer.handle_request(req, res, next);
        } else {
          next(err);
        }
      } else {
        // 中间件
        if (layer.path.match(pathname)) {
          removed = layer.path.prefix;
          req.url = req.url.slice(removed.length);
          if (removed.length === pathname.length) req.url = "/" + req.url;
          if (err) {
            layer.handle_error(err, req, res, next);
          } else {
            layer.handle_request(req, res, next);
          }
        } else {
          next(err);
        }
      }
    }
    next();
  }

  use(path, ...objs) {
    if (typeof path !== "string") {
      objs.unshift(path);
      path = "/";
    }
    let layer;
    for (let handlerOrRouter of objs) {
      if (handlerOrRouter instanceof Router) {
        let router = handlerOrRouter;
        layer = new MiddleLayer(path, router.handle.bind(router));
      } else {
        let handler = handlerOrRouter;
        layer = new MiddleLayer(path, handler);
      }
    }
    this.layers.push(layer);
  }
}

methods.forEach(function (method) {
  Router.prototype[method] = function (path, ...args) {
    let route = this.route(path);
    route[method].apply(route, args);
    return this;
  };
});

module.exports = Router;
