const UserModel = require("../models/user");

const createUsers = () => {
  UserModel.collection.drop();


  const makeid = (length) => {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const usernames = [
    "Esther",
    "TY",
    "Lili",
    "Phyllis",
    "Stephanie",
    "Krysta",
    "Richard",
    "Eric",
    "Freddy",
    "Luis",
    "Lauren",
    "Edwin",
    "Raul",
    "Rupa",
    "Vidhi",
    "Joshua",
    "stockLover",
    "Izuku",
    "Light",
    "L",
    "Goku"
  ]
  
  const users = []
  const tournaments = []

  let counter = 20; 
  for (let i=0; i<counter; i++) {
    UserModel.create({
      username: usernames[i],
      password: '123',
      email: makeid(5) + "@gmail.com",
      avatar: "https://i.pravatar.cc/300"
    })
    .then(console.log)
    .catch(err => {
      return;
    })
  }
}

module.exports = createUsers;