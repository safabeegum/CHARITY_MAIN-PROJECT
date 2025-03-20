const Mongoose = require("mongoose");

const quizSchema = new Mongoose.Schema({
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

const quizModel = Mongoose.model("quiz", quizSchema);
module.exports = quizModel;
