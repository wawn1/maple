const Application = require("./application");
const Router = require("./router");

function createApplication() {
  return new Application();
}
createApplication.Router = () => new Router();
module.exports = createApplication;
