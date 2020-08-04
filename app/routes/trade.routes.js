const TradeController = require("../controllers/trade.controller");
const verifyToken = require("../middlewares/verifyToken");
const tradeRestrictions = require("../middlewares/tradeRestricttions");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/trades", TradeController.index);
  app.get("/api/trades/:entryId", TradeController.showTradeByEntryId);
  app.post("/api/trades", [verifyToken, tradeRestrictions], TradeController.create);
  
};
