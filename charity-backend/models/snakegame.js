const Mongoose = require("mongoose");

const snakeGameSchema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "users",  // Reference to the User model
        required: true,
    },
    score: {
        type: Number,  // Store the player's score
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Timestamp of when the game was played
    },
});

const snakeGameModel = Mongoose.model("snakegame", snakeGameSchema);
module.exports = snakeGameModel;