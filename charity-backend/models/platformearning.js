const Mongoose = require("mongoose");

const platformEarningSchema = new Mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        receivedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const platformEarningModel = Mongoose.model("platformearning", platformEarningSchema);

module.exports = platformEarningModel;
