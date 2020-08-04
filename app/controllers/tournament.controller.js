const TournamentModel = require("../models/tournament");

const TournamentController = {
  index: async (req, res) => {
    const tournaments = await TournamentModel.find({})
      .populate({ path: 'createdBy' })
      .populate({ path: 'entries' })
    tournamentsFormatted = tournaments.map(tournament => {
      return {
        id: tournament._id,
        name: tournament.name,
        createdBy: tournament.createdBy,
        entryFee: tournament.entryFee,
        entryLimit: tournament.entryLimit,
        entries: tournament.entries,
        totalPrize: tournament.entryFee * tournament.entries.length,
        startTime: tournament.startTime,
        endTime: tournament.endTime
      }
    })
    res.send(tournamentsFormatted)  
  },
  show: async (req, res) => {
    const tournament = await TournamentModel.findOne({ name: req.params.name})
      .populate({ path: 'createdBy', select: 'username -_id' })
    if (!tournament) return res.send({error: "No user tournament"})

    res.send(tournament)  
  },
  create: async (req, res) => {
    const tournament = new TournamentModel({
      name: req.body.name,
      createdBy: req.userId,
      entryFee: req.body.entryFee, 
      entryLimit: req.body.entryLimit,
      startTime: req.body.startTime,
      endTime: req.body.endTime
    });
    tournament.save((err, tournamentCreated) => {
      if (err) return res.send({error: err})
      res.send(tournamentCreated)
    })
  }
}

module.exports = TournamentController;