const Mongoose = require('mongoose');
const postSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    name:{
        type: String,
    },
    age:{
        type: String,
    },
    location:{
        type: String,
    },
    contact:{
        type: String,
    },
    purpose:{
        type:String,
        enum:['medical','education','disaster','palliative','livelihood','other']
    },
    image: {
        type: String, // Image URL OR Proof Document URL
        required: true
    },
    documentType: {
        type: String, // Can be "image" or "document"
        default: "image"
    },
    requiredAmount: {
        type: Number,
        required: true
    },
    collectedAmount: {
         type: Number, 
         default: 0 
    },
    accountName:{
        type:String
    },
    accountNo:{
        type:String
    },
    ifsc:{
        type:String
    },
    bankName:{
        type:String,
        enum:['sbi','federal','axis','hdfc','pnb','icici']
    },
    currentDonationsReceived: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "pending",
        enum: ['pending', 'approved', 'rejected'],
    },
    rejectionReason: {
        type: String, // If rejected, add the reason here
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postModel = Mongoose.model("post", postSchema);
module.exports = postModel;


