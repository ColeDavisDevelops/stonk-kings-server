const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TournamentSchema = new Schema({
  name: String,
  entries: [{
    type: Schema.Types.ObjectId,
    ref: "Entry"    
  }], 
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  entryFee: Number,
  entryLimit: Number,
  startTime: Date,
  endTime: Date,
  winners: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }] 
})

module.exports = mongoose.model("Tournament", TournamentSchema);