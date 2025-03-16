const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    topic: {
        type: String,  // Fix: Define type properly
        required: true // Optional: Ensures topic is always provided
    },
    likes: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AnnouncementModel = mongoose.model("announcement", announcementSchema);
module.exports = AnnouncementModel;
