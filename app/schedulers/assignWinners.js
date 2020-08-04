const TournamentModel = require("../models/tournament");
const UserModel = require("../models/user");

// scheduler
const assignWinnerScheduler = () => {
  const assignWinner = () => {
    TournamentModel.find({})
      .populate("entries")
      .exec((err, tournaments) => {
        if (err) {
          return;
        }
        tournaments.forEach(tournament => {
          if (tournament.endTime < new Date() && (tournament.winners.length === 0) && tournament.entries.length !== 0) {
            const balances = tournament.entries.map(entry => entry.tournamentBalance);
            const highestBalance = Math.max(...balances);
            const winners = tournament.entries.filter(entry => entry.tournamentBalance === highestBalance);
            winners.forEach(winner => {
              UserModel.findById(winner.user)
                .exec((err, user) => {
                  if (err) {
                    return;
                  }
                  user.accountBalance += tournament.entryFee * tournament.entries.length;
                  user.wins += 1;
                  user.save(err => {
                    if (err) {
                      return;
                    }
                  });
                })
            })
            tournament.winners = winners;
            tournament.save();
          }
        });
      });
  }
  setInterval(assignWinner, 10000);
}

module.exports = assignWinnerScheduler;

