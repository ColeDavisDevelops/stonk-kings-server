const User = require("../models/user");
const Tournament = require("../models/tournament");
const Entry = require("../models/entry");

const verifyPermissionToEnter = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) res.status(400).send({ message: "User was not found!" });

    const entries = await Entry.find({ user: user.id });
    const hasEntered = entries.some(
      (entry) => req.body.tournamentId === entry.tournament.toString()
    );
    if (hasEntered)
      res
        .status(400)
        .send({ message: "User has already entered this tournament!" });

    const tournament = await Tournament.findById(req.body.tournamentId);
    if (!tournament)
      res.status(400).send({ message: "Tournament was not found!" });

    if (new Date() > new Date(tournament.startTime))
      res.status(400).send({ message: "Tournament has already started!" });

    if (tournament.entryLimit <= tournament.entries.length)
      res.status(400).send({ message: "Tournament is full!" });

    if (user.accountBalance < tournament.entryFee)
      res.status(400).send({ message: "User funds insufficient for entry!" });

    const priorBalance = user.accountBalance;
    user.accountBalance = priorBalance - tournament.entryFee;
    req.tournament = tournament;
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = verifyPermissionToEnter;
