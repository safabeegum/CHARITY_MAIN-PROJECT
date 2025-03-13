const Mongoose = require("mongoose");

const quizSchema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "users",  // Reference to the User model
        required: true,
    },
    score: {
        type: Number,  // Store the highest score achieved
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Timestamp when the quiz was played
    },
});

const quizModel = Mongoose.model("quiz", quizSchema);
module.exports = quizModel;
