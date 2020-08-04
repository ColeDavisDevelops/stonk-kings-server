const verifyToken = require("../middlewares/verifyToken");
const userController = require("../controllers/user.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/users", userController.index);
  app.get("/api/users/:username", userController.show);
  app.patch("/api/users/:username", verifyToken, userController.update);
  
};
