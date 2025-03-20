const Mongoose = require("mongoose");

const snakeGameSchema = new Mongoose.Schema({
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

const snakeGameModel = Mongoose.model("snakegame", snakeGameSchema);
module.exports = snakeGameModel;
