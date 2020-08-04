const EntryController = require("../controllers/entry.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyPermissionToEnter = require("../middlewares/verifyPermissionToEnter");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/entries", EntryController.index);
  app.get("/api/entries/user/:username", EntryController.showByUsername);
  app.get("/api/entries/tournament/:tournamentId", EntryController.showByTournamentId);
  app.get("/api/entries/:userId/:tournamentId", EntryController.showByUsernameAndTournamentName);
  app.post("/api/entries", [verifyToken, verifyPermissionToEnter], EntryController.create);
  
};
