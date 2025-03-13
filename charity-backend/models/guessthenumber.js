const Mongoose = require("mongoose");

const guessTheNumberSchema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "users",  // Reference to the User model
        required: true,
    },
    attempts: {
        type: Number,  // Store the number of attempts
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Timestamp of when the game was played
    },
});

const guessTheNumberModel = Mongoose.model("guessthenumber", guessTheNumberSchema);
module.exports = guessTheNumberModel;
