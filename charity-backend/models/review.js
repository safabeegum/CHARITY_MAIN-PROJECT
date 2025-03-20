const Mongoose = require("mongoose");
const reviewSchema = Mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
});
const reviewModel = Mongoose.model("review", reviewSchema);
module.exports = reviewModel;
