const config = require("../config/auth.config");
const User = require("../models/user");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  try {
    const result = await user.save();
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    const response = result._doc;
    delete response.password;
    res.status(200).send({
      ...response,
      accessToken: token,
    });
  } catch (ex) {
    const formattedErrObj = Object.keys(ex.errors).reduce((hash, key) => {
      switch (key) {
        case "username":
          hash["username"] = "Sorry, this username is already in use!";
          break;
        case "email":
          hash["email"] = "Sorry, this email is already in use!";
          break;
        default:
          break;
      }
      return hash;
    }, {});
    res.status(400).send(formattedErrObj);
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user)
      res.status(404).send({ message: "Invalid username or password!" });

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      res.status(401).send({ message: "Invalid username or password!" });

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const response = user._doc;
    delete response.password;
    res.status(200).send({
      ...response,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.getUserWithToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) res.send({ error: "token expired" });

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const response = user._doc;
    delete response.password;
    res.status(200).send({
      ...response,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
