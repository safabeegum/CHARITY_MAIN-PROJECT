const Mongoose = require("mongoose");

const announcementSchema = new Mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AnnouncementModel = Mongoose.model("announcement", announcementSchema);
module.exports = AnnouncementModel;
