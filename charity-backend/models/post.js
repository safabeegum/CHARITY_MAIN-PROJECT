const Mongoose = require("mongoose");
const postSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  age: {
    type: String,
  },
  location: {
    type: String,
  },
  contact: {
    type: String,
  },
  purpose: {
    type: String,
    enum: [
      "medical",
      "education",
      "disaster",
      "palliative",
      "livelihood",
      "other",
    ],
  },
  image: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    default: "image",
  },
  requiredAmount: {
    type: Number,
    required: true,
  },
  accountName: {
    type: String,
  },
  accountNo: {
    type: String,
  },
  ifsc: {
    type: String,
  },
  bankName: {
    type: String,
    enum: ["sbi", "federal", "axis", "hdfc", "pnb", "icici"],
  },
  currentDonationsReceived: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
  rejectionReason: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const postModel = Mongoose.model("post", postSchema);
module.exports = postModel;
