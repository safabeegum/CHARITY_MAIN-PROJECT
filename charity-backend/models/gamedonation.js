const Mongoose = require("mongoose");

const gameDonationSchema = new Mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  amount: {
    type: Number,
    default: 10,
    immutable: true,
  },
  method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
gameDonationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
const gameDonationModel = Mongoose.model("gamedonation", gameDonationSchema);
module.exports = gameDonationModel;
