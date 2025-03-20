const Mongoose = require("mongoose");

const rewardSchema = new Mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  upiId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0.2,
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  },
});

const rewardModel = Mongoose.model("reward", rewardSchema);
module.exports = rewardModel;
