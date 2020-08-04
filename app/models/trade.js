const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
  entry: {
    type: Schema.Types.ObjectId,
    ref: "Entry"
  },
  stockTicker: String,
  time: Date,
  buyOrSell: String,
  price: Number, 
  amountOfShares: Number 
});

module.exports = mongoose.model("Trade", TradeSchema);