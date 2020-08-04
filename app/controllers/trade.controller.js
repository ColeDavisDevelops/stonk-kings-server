const TradeModel = require("../models/trade");

const TradeController = {
  index: async (req, res) => {
    const trades = await TradeModel.find({})
    res.send(trades);
  },
  showTradeByEntryId: async (req, res) => {
    const trades = await TradeModel.find({ entry: req.params.entryId });
    res.send(trades);
  },
  create: async (req, res) => {
    const trade = new TradeModel({
      entry: req.body.entryId,
      stockTicker: req.body.stockTicker,
      time: req.body.time,
      buyOrSell: req.body.buyOrSell,
      price: req.body.price,
      amountOfShares: req.body.amountOfShares
    });
    trade.save((err, tradeCreated) => {
      if (err) return res.send({error: err})
      if (req.body.buyOrSell === "buy") {
        const oldBalance = req.entry.tournamentBalance;
        req.entry.tournamentBalance = oldBalance - (req.body.amountOfShares * req.body.price) 
      } else {
        const sharesSoldVal = req.body.amountOfShares * req.body.price;
        const oldBalance = req.entry.tournamentBalance;
        req.entry.tournamentBalance = oldBalance + sharesSoldVal;
      }
      req.entry.trades.push(tradeCreated._id);
      req.entry.save();
      res.send(tradeCreated)
    })
  }
}

module.exports = TradeController;