const TournamentModel = require("../models/tournament");
const UserModel = require("../models/user");

const createTournaments = async () => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  TournamentModel.collection.drop();

  const users = UserModel.find({}).catch(e => console.log(e))
    
      console.log(users)

}

module.exports = createTournaments;
