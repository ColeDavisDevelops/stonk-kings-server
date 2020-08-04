const User = require("../models/user");
const Tournament = require("../models/tournament");
const Entry = require("../models/entry");

const verifyPermissionToEnter = (req, res, next) => {
  // Username
  User.findById(req.userId)
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        res.status(400).send({ message: "User was not found!" });
        return;
      }
      Entry.find({ user: user.id })
        .exec((err, entries) => {
          if (err) {
            next(err);
          }
          const hasEntered = entries.some(entry => (req.body.tournamentId === entry.tournament.toString()))
          if (hasEntered) {
            res.status(400).send({ message: "User has already entered this tournament!" });
            return;
          }
          Tournament.findById(req.body.tournamentId)
            .exec((err, tournament) => {
              if (err) {
                res.status(500).send({message: err});
                return;
              }
              if (!tournament) {
                res.status(400).send({ message: "Tournament was not found!" });
                return;
              }
              if (new Date() > new Date(tournament.startTime)) {
                res.status(400).send({ message: "Tournament has already started!" });
                return;
              }
              if (tournament.entryLimit <= tournament.entries.length) {
                res.status(400).send({ message: "Tournament is full!" });
                return;
              }
              if (user.accountBalance < tournament.entryFee) {
                res.status(400).send({message: "User funds insufficient for entry!"})
                return;
              }
              
              const priorBalance = user.accountBalance;
              user.accountBalance = priorBalance - tournament.entryFee;
              req.tournament = tournament;
              req.user = user;
              next();
            });
          });
        })
};

module.exports = verifyPermissionToEnter;