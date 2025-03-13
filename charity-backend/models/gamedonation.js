const Mongoose = require("mongoose");

const gameDonationSchema = new Mongoose.Schema({
    userId: { type: Mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    amount: { type: Number, default: 2, immutable: true }, // ₹2 Fixed Amount
    method: { type: String, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// ✅ Auto-update `updatedAt`
gameDonationSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const gameDonationModel = Mongoose.model("gamedonation", gameDonationSchema);
module.exports = gameDonationModel;
