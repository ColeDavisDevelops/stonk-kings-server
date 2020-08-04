const verifyToken = require("../middlewares/verifyToken");
const TournamentController = require("../controllers/tournament.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/tournaments", TournamentController.index);
  app.get("/api/tournaments/:name", TournamentController.show);
  app.post("/api/tournaments", verifyToken, TournamentController.create);
};