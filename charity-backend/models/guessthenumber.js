const Mongoose = require("mongoose");

const guessTheNumberSchema = new Mongoose.Schema({
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
const guessTheNumberModel = Mongoose.model(
  "guessthenumber",
  guessTheNumberSchema
);
module.exports = guessTheNumberModel;
