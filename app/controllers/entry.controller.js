const EntryModel = require("../models/entry");

const EntryController = {
  index: async (req, res) => {
    const found = await EntryModel.find({})
      .populate({ path: "user", select: "username -_id" })
      .populate("tournament");
    res.send(found);
  },
  showByUsername: async (req, res) => {
    const found = await EntryModel.find({})
      .populate({ path: "user", select: "username -_id" })
      .populate("tournament");
    const foundByUser = found.filter(
      (entry) => entry.user.username === req.params.username
    );
    res.send(foundByUser);
  },
  showByTournamentId: async (req, res) => {
    const found = await EntryModel.find({
      tournament: req.params.tournamentId,
    }).populate({ path: "user" });
    res.send(found);
  },
  showByUsernameAndTournamentName: async (req, res) => {
    const found = await EntryModel.findOne({
      user: req.params.userId,
      tournament: req.params.tournamentId,
    });
    if (!found) return res.send({ message: "entry not found" });
    res.send(found);
  },
  // change to await
  create: async (req, res) => {
    const entry = new EntryModel({
      user: req.userId,
      tournament: req.body.tournamentId,
    });
    entry
      .save()
      .then((entryCreated) => {
        req.tournament.entries.push(entryCreated._id);
        req.user.entries.push(entryCreated._id);
        req.user.save();
        req.tournament.save();
        res.send(entryCreated);
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  },
};

module.exports = EntryController;
