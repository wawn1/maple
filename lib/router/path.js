const pathToRegexp = require("path-to-regexp");

class Path {
  constructor(path, isRoute) {
    this.path = path;
    this.isRoute = isRoute;
    this.paramsNames = [];
    this.reg_path = pathToRegexp(this.path, this.paramsNames, {end: isRoute});
    this.prefix = "";
    this.params = {};
  }
  match(path) {
    // 判断路径是否匹配，中间件只需要前缀匹配，路由需要完全匹配
    if (this.path === path) {
      return true;
    }
    let matches = this.reg_path.exec(path);
    if (matches) {
      if (!this.isRoute) this.prefix = matches[0];
      for (let i = 0; i < this.paramsNames.length; i++) {
        let name = this.paramsNames[i];
        let val = matches[i + 1];
        this.params[name] = val;
      }
      return true;
    }
    return false;
  }
}

module.exports = Path;
