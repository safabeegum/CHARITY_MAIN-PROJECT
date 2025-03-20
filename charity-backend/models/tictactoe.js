const Mongoose = require("mongoose");

const ticTacToeSchema = new Mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ticTacToeModel = Mongoose.model("tictactoe", ticTacToeSchema);
module.exports = ticTacToeModel;
