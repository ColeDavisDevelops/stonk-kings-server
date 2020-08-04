const UserModel = require("../models/user");

const UserController = {
  index: async (req, res) => {
    const found = await UserModel.find({});
    res.send(found)  
  },
  show: async (req, res) => {
    const found = await UserModel.findOne({ username: req.params.username });
    if (!found) return res.send({error: "No user found"})
    res.send(found)  
  },
  update: async (req, res) => {
    UserModel.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      (err, updatedUser) => {
        if (err) return res.send({error: err});
        res.send(updatedUser)
      }
    );
  },
}

module.exports = UserController;