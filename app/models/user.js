const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  avatar: {
    type: String,
    default:
      "https://img.favpng.com/3/11/25/avatar-youtube-cat-png-favpng-PRA6iZsrgWAqXFqmjMsfSvuPG.jpg",
  },
  accountBalance: { type: Number, default: 10000 },
  wins: { type: Number, default: 0 },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  entries: [
    {
      type: Schema.Types.ObjectId,
      ref: "Entry",
    },
  ],
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
