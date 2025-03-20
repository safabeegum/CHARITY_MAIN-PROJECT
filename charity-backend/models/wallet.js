const Mongoose = require("mongoose");

const walletSchema = new Mongoose.Schema(
  {
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["reward", "donation", "withdrawal"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const walletModel = Mongoose.model("wallet", walletSchema);
module.exports = walletModel;
