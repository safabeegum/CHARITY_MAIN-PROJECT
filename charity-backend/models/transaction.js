const Mongoose = require("mongoose");

const transactionSchema = new Mongoose.Schema({
  postId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
  requiredAmount: {
    type: Number,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  accountNo: {
    type: String,
    required: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const transactionModel = Mongoose.model("transaction", transactionSchema);
module.exports = transactionModel;
