const Mongoose = require("mongoose");

const hangmanSchema = new Mongoose.Schema({
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

const hangmanModel = Mongoose.model("hangman", hangmanSchema);
module.exports = hangmanModel;
