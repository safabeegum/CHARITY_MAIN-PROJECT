const Mongoose = require("mongoose");

const paymentSchema = new Mongoose.Schema({
    userId: { type: Mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    postId: { type: Mongoose.Schema.Types.ObjectId, ref: "post", required: true },  
    amount: { type: Number, required: true },
    method: { type: String, required: true, enum: ["card", "upi", "bank"] },
    status: { type: String, default: "pending" }, // success, failed, pending
    createdAt: { type: Date, default: Date.now }
});

const paymentModel = Mongoose.model("payments", paymentSchema);
module.exports = paymentModel;
