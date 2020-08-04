const Entry = require("../models/entry");
const Trade = require("../models/trade");

// user must have sufficient balance
// user must be owner of the entry

const tradeRestrictions = (req, res, next) => {
  Entry.findById(req.body.entryId)
    .exec(async (err, entry) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!entry) {
        res.status(400).send({ message: "entry does not exist!" });
        return;
      }
      if (entry.user.toString() !== req.userId) {
        res.status(400).send({ message: "User and entry do not match!" });
        return;
      }
      if (req.body.buyOrSell === "buy") {
        if (entry.tournamentBalance < (req.body.amountOfShares * req.body.price)) {
          res.status(400).send({ message: "User does not have enough funds to make this trade!" });
          return;
        }
        req.entry = entry;
        next();
        
      } else {
        // if sell, then user must have enough shares of the stock to sell
        Trade.find({entry: entry._id})
          .exec((err, trades) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            const allTickers = trades.map(t => t.stockTicker);
            if (!allTickers.includes(req.body.stockTicker)) {
              res.status(400).send({ message: "User does not have any shares to sell!"});
              return;
            }
            const uniqueTickers = allTickers.filter((val, index, self) => self.indexOf(val) === index);
            const positions = uniqueTickers.map(ticker => {
              const position = {
                ticker: ticker,
                netShares: 0
              }
              trades.forEach(async trade => {
                if (trade.stockTicker === ticker) {
                  if (trade.buyOrSell === "buy") {
                    position.netShares = position.netShares + trade.amountOfShares
                  } else {
                    position.netShares = position.netShares - trade.amountOfShares
                  }
                }
              });
              return position;
            });
            if (positions === null) {
              res.status(400).send({ message: "no positions were found try again" })
              return;
            }
            // console.log(positions)
            let eligibleToSell = true;
            positions.forEach(position => {
              if (position.ticker === req.body.stockTicker) {
                if (position.netShares < req.body.amountOfShares) {
                  eligibleToSell = false;
                }
              }
            });
            if (!eligibleToSell) {
              res.status(400).send({ message: "You dont have enough shares to sell" })
              return;
            }
            req.entry = entry;
            next();
          })
      }
    })
};

module.exports = tradeRestrictions;

