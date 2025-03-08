const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true, enum: ["card", "upi", "bank"] },
    status: { type: String, default: "pending" }, // success, failed, pending
    createdAt: { type: Date, default: Date.now }
});

const paymentModel = mongoose.model("payments", paymentSchema);
module.exports = paymentModel;
