const Express = require("express"); 
const Mongoose = require("mongoose");
const Cors = require("cors");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const nodemailer = require('nodemailer');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const EventEmitter = require('events');
const paymentEvents = new EventEmitter();
const cron = require('node-cron');

const userModel = require("./models/users");
const adminModel = require("./models/admin");
const socialworkersModel = require("./models/socialworkers");
const reviewModel = require("./models/review");
const paymentModel = require("./models/payment");
const postModel = require("./models/post");
const gameDonationModel = require("./models/gamedonation");
const platformEarningModel = require('./models/platformearning');
const guessTheNumberModel = require("./models/guessthenumber");
const quizModel = require("./models/quiz");
const ticTacToeModel = require("./models/tictactoe");
const snakeGameModel = require("./models/snakegame");
const hangmanModel = require("./models/hangman");
const transactionModel = require("./models/transaction");
const walletModel = require('./models/wallet');  
const rewardModel = require("./models/reward");
const announcementModel = require("./models/announcement");
const emergencyModel = require("./models/emergency");
const GameModels = [quizModel, guessTheNumberModel, ticTacToeModel, snakeGameModel, hangmanModel];


let app = Express(); 
app.use(Express.json()); 
app.use(Cors()); 

Mongoose.connect("mongodb+srv://safabeegum:mongodb24@cluster0.pbzbbey.mongodb.net/CharityApp?retryWrites=true&w=majority&appName=Cluster0")

app.use('/uploads', Express.static('uploads'));


//Admin Login
app.post("/adminlogin",async(req,res) => {
    let input = req.body 
    let result = adminModel.find({email:req.body.email}).then(
        (items)=>{
            if(items.length>0)
            {
                const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password)
                if(passwordValidator)
                {
                    jwt.sign({email:req.body.email},"CharityApp",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) 
                            {
                                res.json({"status":"Error","error":error})
                            } 
                            else 
                            {
                                res.json({"status":"Success","token":token,"adminId":items[0]._id})
                            }
                        }
                    )
                }
                else
                {
                    res.json({"status":"Incorrect Password"})
                }
            }
            else{
                res.json({"status":"Invalid Email ID"})
            }
        }
    )
})

//Admin Register
app.post("/adminregister", (req, res) => {
    let input = req.body;
    let hashedPassword = Bcrypt.hashSync(input.password, 10)
    input.password = hashedPassword
    let result = new adminModel(input)
    result.save();
    res.json({ status: "Success" })
  });

//Login
app.post("/login", async (req, res) => {
    let input = req.body;
    let result = userModel.find({ email: req.body.email }).then((items) => {
        if (items.length > 0) {
            const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password);
            if (passwordValidator) {
                jwt.sign(
                    { userId: items[0]._id, email: req.body.email },  
                    "CharityApp",
                    { expiresIn: "1d" },
                    (error, token) => {
                        if (error) {
                            res.json({ "status": "Error", "error": error });
                        } else {
                            res.json({ "status": "Success", "token": token });
                        }
                    }
                );
            } else {
                res.json({ "status": "Incorrect Password" });
            }
        } else {
            res.json({ "status": "Invalid Email ID" });
        }
    });
});


//Register
app.post("/register", async(req,res)=> {
    let input = req.body 
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
    let check = await userModel.find({email:req.body.email})
        if(check.length>0)
        {
            res.json({"status":"Email ID already exists"})
        }
        else
        {
            let result = new userModel(input)
            await result.save()
            res.json({"status":"Success"})
        }

})

//Social Workers Login
app.post("/socialworkerslogin", async (req, res) => {
    try {
        let user = await socialworkersModel.findOne({ email: req.body.email });
        if (!user) {
            return res.json({ "status": "Invalid Email ID" });
        }
        let passwordMatches = false;
        if (user.password.startsWith("$2b$")) {
            passwordMatches = bcrypt.compareSync(req.body.password, user.password);
        } else {
            passwordMatches = req.body.password === user.password;
        }
        if (passwordMatches) {
            jwt.sign(
                { email: req.body.email }, 
                "CharityApp", 
                { expiresIn: "1d" }, 
                (error, token) => {
                    if (error) {
                        res.json({ "status": "Error", "error": error });
                    } else {
                        res.json({ "status": "Success", "token": token, "userId": user._id });
                    }
                }
            );
        } else {
            res.json({ "status": "Incorrect Password" });
        }
    } catch (error) {
        res.json({ "status": "Error", "error": error.message });
    }
});

//-----------------------------------------------------ADMIN DASHBOARD------------------------------------------------------------------------

//Admin Dashboard
app.post("/api/admindashboard", async (req, res) => {
    try {
      const usersCount = await userModel.countDocuments();
      const socialWorkersCount = await socialworkersModel.countDocuments();
      const pendingReportsCount = await postModel.countDocuments({ status: "pending" });  
      const donationCount = await paymentModel.countDocuments(); 
    const gamedonationCount = await gameDonationModel.countDocuments();
      res.json({
        users: usersCount,
        socialWorkers: socialWorkersCount,
        pendingApprovals: pendingReportsCount, 
        donation: donationCount+gamedonationCount
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ status: "Error", message: "Failed to fetch dashboard stats" });
    }
  });
  
//User Activity
app.post("/api/useractivity", async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const activity = await userModel.aggregate([
            {
                $match: { createdAt: { $gte: last7Days } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(activity.length > 0 ? activity.map(item => ({ date: item._id, count: item.count })) : []);
    } catch (error) {
        console.error("Error fetching user activity:", error);
        res.status(500).json({ status: "Error", message: "Failed to fetch user activity" });
    }
});

//Transaction Activity
app.post("/api/transactionactivity", async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const transactions = await transactionModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: last7Days },
                    status: "success"
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalAmount: { $sum: "$requiredAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(transactions.length > 0 ? transactions.map(t => ({ date: t._id, totalAmount: t.totalAmount })) : []);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ status: "Error", message: "Failed to fetch transaction data" });
    }
});

//Manage Users
app.post("/manageusers", async (req, res) => {
    let token = req.headers.token;
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ status: "Token is missing" });
    }
    jwt.verify(token, "CharityApp", async (error, decoded) => {
      if (error) {
        console.log("JWT verification failed:", error.message);
        return res.status(403).json({ status: "Invalid Token", error: error.message });
      }
      console.log("Token is valid for:", decoded.email);
      try {
        const users = await userModel.find();
        console.log("Users retrieved successfully:", users.length);
        res.json(users);
      } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ status: "Error fetching users" });
      }
    })
  })

//Manage Social Workers
app.post("/managesocialworkers", async(req,res)=> {
    let input = req.body 
    let check = await socialworkersModel.find({email:req.body.email})
        if(check.length>0)
        {
            res.json({"status":"Email ID already exists"})
        }
        else
        {
            let result = new socialworkersModel(input)
            await result.save()
            res.json({"status":"Success"})
        }

})

//Manage Users
app.post("/manageusers", async (req, res) => {
    let token = req.headers.token;
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ status: "Token is missing" });
    }
    jwt.verify(token, "CharityApp", async (error, decoded) => {
      if (error) {
        console.log("JWT verification failed:", error.message);
        return res.status(403).json({ status: "Invalid Token", error: error.message });
      }
      console.log("Token is valid for:", decoded.email);
      try {
        const users = await userModel.find();
        console.log("Users retrieved successfully:", users.length);
        res.json(users);
      } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ status: "Error fetching users" });
      }
    })
  })

//Retrieve Social Workers
app.post("/retrievesocialworkers", async (req, res) => {
    let token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      console.log("No token provided in headers");
      return res.status(401).json({ status: "Token is missing" });
    }
    jwt.verify(token, "CharityApp", async (error, decoded) => {
      if (error) {
        console.log("JWT verification failed:", error.message);
        return res.status(403).json({ status: "Invalid Token", error: error.message });
      }
      console.log("Token is valid for:", decoded.email);
      try {
        const users = await socialworkersModel.find({}, "-password"); 
        console.log(`Retrieved ${users.length} social workers successfully.`);
        return res.json(users);
      } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: "Error fetching users", error: err.message });
      }
    });
  });

//Manage Review
app.post("/managereview", async (req, res) => {
    let token = req.headers.token;
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ status: "Token is missing" });
    }
    jwt.verify(token, "CharityApp", async (error, decoded) => {
      if (error) {
        console.log("JWT verification failed:", error.message);
        return res.status(403).json({ status: "Invalid Token", error: error.message });
      }
      console.log("Token is valid for:", decoded.email);
      try {
        const review = await reviewModel.find();
        console.log("Review retrieved successfully:", review.length);
        res.json(review);
      } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ status: "Error fetching review" });
      }
    })
  })

//Pending Posts
app.post("/pendingposts", async (req, res) => {
    try {
        const posts = await postModel
            .find({ status: "pending" });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to fetch pending posts" });
    }
});

//Admin Approval
app.post("/approvepost", async (req, res) => {
    const { postId, action, rejectionReason } = req.body;
    try {
        if (action === 'approve') {
            const post = await postModel.findById(postId);
            if (!post) {
                return res.json({ message: "Post not found" });
            }
            post.status = "approved";
            await post.save();
            const pendingDonations = await gameDonationModel.find({ status: "pending", postId: null });
            let totalAllocated = 0;
            let totalPlatformFee = 0;
            for (const donation of pendingDonations) {
                const charityAmount = donation.amount * 0.7;  
                const platformFee = donation.amount * 0.1;   
                const remaining = donation.amount * 0.2;     
                donation.postId = post._id;
                donation.status = "success";
                await donation.save();
                totalAllocated += charityAmount;
                totalPlatformFee += platformFee;
            }
            post.currentDonationsReceived += totalAllocated;
            if (post.currentDonationsReceived >= post.requiredAmount) {
                post.status = 'funded';  
            }
            await post.save();
            return res.json({ 
                message: `Post approved! Allocated ₹${totalAllocated} to charity. 
                          Platform Fee: ₹${totalPlatformFee}.`
            });
        }
        if (action === 'reject') {
            await postModel.findByIdAndUpdate(postId, { status: 'Rejected', rejectionReason });
            return res.json({ message: "Post rejected successfully" });
        }
    } catch (error) {
        console.error("Approval Error:", error);
        res.status(500).json({ message: "Failed to approve/reject post" });
    }
});

//Approved Posts
app.get("/approvedposts", async (req, res) => {
    try {
        const posts = await postModel.find({ status: "approved" });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to fetch approved posts" });
    }
});

//Rejected Posts
app.get("/rejectedposts", async (req, res) => {
    try {
        const posts = await postModel.find({ status: "Rejected" });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to fetch rejected posts" });
    }
});

//Game Payments
app.get("/gamepayments", async (req, res) => {
    try {
        const gamedonation = await gameDonationModel.find().sort({ createdAt: -1 });
        return res.json(gamedonation);
    } catch (error) {
        console.error("Fetch Payments Error:", error);
        return res.status(500).json({ status: "Failed", message: "Could not fetch payments" });
    }
});

//Donations
app.get("/donations", async (req, res) => {
    try {
        const donations = await paymentModel.find().populate("userId", "name email").populate("postId");
        return res.json(donations);
    } catch (error) {
        console.error("Fetch Donations Error:", error);
        return res.status(500).json({ status: "Failed", message: "Could not fetch donations" });
    }
});

//Completed Posts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
app.get("/completedposts", async (req, res) => {
    try {
        let allApprovedPosts = await postModel.find({
            status: "approved"
        });
        console.log("ALL Approved Posts After Fix:", JSON.stringify(allApprovedPosts, null, 2)); 
        let completedPosts = allApprovedPosts.filter(post => {
            let received = Number(post.currentDonationsReceived) || 0;
            let required = Number(post.requiredAmount) || 0;
            return received >= required;
        });
        console.log("Completed Posts After Filtering:", completedPosts);
        res.json(completedPosts);
    } catch (error) {
        console.error("Fetch Completed Posts Error:", error);
        res.status(500).json({ status: "Failed", message: "Could not fetch completed posts" });
    }
});

//Transaction
app.post("/transaction", async (req, res) => {
    try {
        const { postId } = req.body;
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const transactionData = {
            postId: post._id,
            requiredAmount: post.requiredAmount,
            accountName: post.accountName,
            accountNo: post.accountNo,
            ifsc: post.ifsc,
            bankName: post.bankName,
            status: "success", 
        };
        const newTransaction = new transactionModel(transactionData);
        await newTransaction.save();
        await postModel.findByIdAndUpdate(postId, { status: "success" });
        res.status(201).json({ message: "Transaction successful", transaction: newTransaction });
    } catch (error) {
        console.error("Transaction Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

//Transaction List
app.get("/transactions", async (req, res) => {
    try {
        const transactions = await transactionModel.find({}, { postId: 0, __v: 0 }); 
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Server error" });
    }
});

//Reward List
app.post("/rewardslist", async (req, res) => {
    try {
      const rewards = await rewardModel.find().populate("userId", "name email");
      if (rewards.length === 0) {
        return res.status(404).json({ message: "No rewards found" });
      }
      res.status(200).json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });
  
//Admin Report
app.post("/adminreport", async (req, res) => {
    try {
        const totalDonations = await paymentModel.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalRewards = await rewardModel.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalTransactions = await transactionModel.aggregate([
            { $group: { _id: null, total: { $sum: "$requiredAmount" } } },
        ]);
        const totalGameFunds = await gameDonationModel.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const walletAmount = await walletModel.aggregate([
            { $group: { _id: null, total: { $sum: "$balance" } } },
        ]);
        const platformEarnings = await platformEarningModel.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        res.status(200).json({
            totalDonations: totalDonations[0]?.total || 0,
            totalRewards: totalRewards[0]?.total || 0,
            totalTransactions: totalTransactions[0]?.total || 0,
            totalGameFunds: totalGameFunds[0]?.total || 0,
            walletAmount: walletAmount[0]?.total || 0,
            platformEarnings: platformEarnings[0]?.total || 0,
        });
    } catch (error) {
        console.error("Error fetching admin report:", error);
        res.status(500).json({ message: "Error fetching report." });
    }
});

//-----------------------------------------------------ADMIN DASHBOARD------------------------------------------------------------------------

//-----------------------------------------------------USER DASHBOARD-------------------------------------------------------------------------

//Post a Review
app.post("/review", async (req, res) => {
    let { review, rating } = req.body;
    let token = req.headers.authorization?.split(" ")[1];
    if (!review || review.trim() === "") {
        return res.status(400).json({ status: "Error", message: "Review is required" });
    }
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ status: "Error", message: "Rating must be between 1 and 5" });
    }
    try {
        const decoded = jwt.verify(token, "CharityApp");
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }
        let newReview = new reviewModel({
            userId: user._id,
            review,
            rating,
            email: user.email
        });
        await newReview.save();
        res.status(201).json({ status: "Success", message: "Review submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(401).json({ status: "Error", message: "Invalid Token" });
    }
});

//My Profile
app.post("/myprofile", async (req, res) => {
    let token = req.headers.token;
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ status: "Token is missing" });
    }
    jwt.verify(token, "CharityApp", async (error, decoded) => {
        if (error) {
            console.log("JWT verification failed:", error.message);
            return res.status(403).json({ status: "Invalid Token", error: error.message });
        }
        console.log("Fetching profile for:", decoded.email);
        try {
            const user = await userModel.findOne({ email: decoded.email });
            if (!user) {
                return res.status(404).json({ status: "User not found" });
            }
            console.log("User profile retrieved:", user);
            res.json(user);
        } catch (err) {
            console.error("Database error:", err);
            res.status(500).json({ status: "Error fetching user profile" });
        }
    });
});


//EditProfile Modal
app.put("/editprofilemodal", async (req, res) => {
    console.log("Received update request:", req.body);
    let token = req.headers.token;
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ status: "Token is missing" });
    }
    jwt.verify(token, "CharityApp", async (error, decoded) => {
        if (error) {
            console.log("JWT verification failed:", error.message);
            return res.status(403).json({ status: "Invalid Token", error: error.message });
        }
        console.log("Updating profile for:", decoded.email);
        try {
            const updatedUser = await userModel.findOneAndUpdate(
                { email: decoded.email },  
                { $set: req.body },         
                { new: true }               
            );
            if (!updatedUser) {
                console.log("User not found");
                return res.status(404).json({ status: "User not found" });
            }
            console.log("Profile updated successfully:", updatedUser);
            res.json({ status: "Success", user: updatedUser });
        } catch (err) {
            console.error("Database error:", err);
            res.status(500).json({ status: "Error updating profile" });
        }
    });
});

//Game Payment
app.post("/gamepayment", async (req, res) => {
    try {
        const { method } = req.body;
        const fixedAmount = 10;  
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ status: "Error", message: "Token is missing! Unauthorized access" });
        }
        const decoded = jwt.verify(token, "CharityApp");
        const userId = decoded.userId;
        const payment = await gameDonationModel.create({
            userId,
            amount: fixedAmount,
            method,
            status: "pending"
        });
        console.log("Game Donation Stored:", payment);
        paymentEvents.emit('allocateDonation', payment);
        return res.status(200).json({
            status: "Success",
            message: "Dummy Payment Processed",
            paymentId: payment._id 
        });
    } catch (error) {
        console.error("Payment Error:", error);
        return res.status(500).json({ status: "Failed", message: "Payment Failed" });
    }
});

paymentEvents.on('allocateDonation', async (payment) => {
    console.log(" Event Triggered: allocateDonation with payment ID:", payment._id);
    try {
        console.log("Processing donation allocation...");
        const donationAmount = payment.amount * 0.7; 
        const charityPost = await postModel.findOne({
            status: "approved",
            $expr: { $gt: ["$requiredAmount", "$currentDonationsReceived"] } 
        }).sort({ requiredAmount: -1 });
        if (charityPost) {
            console.log(`Charity Post Found: ${charityPost._id}, Adding ₹${donationAmount}`);
            charityPost.currentDonationsReceived += donationAmount;
            await charityPost.save();
            payment.status = "success";
            await payment.save();
            console.log(` ₹${donationAmount} donated to charity post: ${charityPost._id}`);
            const platformEarning = payment.amount * 0.1; 
            await platformEarningModel.create({
                amount: platformEarning
            });
            console.log(`₹${platformEarning} added to platform earnings.`);
        } else {
            console.log("No eligible charity post found, keeping donation pending.");
            payment.status = "pending";
            await payment.save();
        }
    } catch (error) {
        console.error("Donation Allocation Error:", error);
    }
});

async function approvePost(postId) {
    try {
        const post = await postModel.findById(postId);
        if (!post) {
            console.log("Post not found.");
            return;
        }
        post.status = "approved";
        await post.save();
        console.log(`Post ${postId} approved successfully.`);
        await allocatePendingDonations();
    } catch (error) {
        console.error("Error approving post:", error);
    }
}

async function allocatePendingDonations() {
    console.log("Checking for pending donations...");
    const pendingDonations = await paymentModel.find({ status: "pending" });
    if (pendingDonations.length === 0) {
        console.log("No pending donations found.");
        return;
    }
    const charityPost = await postModel.findOne({
        status: "approved",
        $expr: { $gt: ["$requiredAmount", "$currentDonationsReceived"] }
    }).sort({ createdAt: 1 }); 
    if (!charityPost) {
        console.log("No eligible charity post found for pending donations.");
        return;
    }
    for (const payment of pendingDonations) {
        const donationAmount = payment.amount * 0.7; 
        console.log(`Allocating ₹${donationAmount} from payment ${payment._id} to charity post ${charityPost._id}`);
        charityPost.currentDonationsReceived += donationAmount;
        await charityPost.save();
        payment.status = "success";
        await payment.save();
    }
    console.log("All pending donations have been allocated!");
}

//Game Rewards
cron.schedule('48 11 * * *', async () => {
    console.log("Scheduled task triggered: Rewarding top scorers...");
    await addRewardsForTopScorers();
});
const addRewardsForTopScorers = async () => {           
    const rewardAmount = 2; 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    for (const GameModel of GameModels) {
        try {
            console.log(`[${new Date().toISOString()}] Checking top scorer for ${GameModel.modelName}...`);
            const topScorer = await GameModel.findOne({ createdAt: { $gte: today } })
                .sort({ score: -1 })  
                .limit(1);
            if (!topScorer) {
                console.log(`No top scorer found for ${GameModel.modelName} today. Skipping...`);
                continue; 
            }
            console.log(`Top scorer found for ${GameModel.modelName}:`, topScorer);
            const session = await Mongoose.startSession();
            session.startTransaction();
            try {
                let userWallet = await walletModel.findOne({ userId: topScorer.userId }).session(session);
                if (!userWallet) {
                    console.log(`No wallet found for user ${topScorer.userId}. Creating one...`);
                    userWallet = new walletModel({ userId: topScorer.userId, balance: 0, transactions: [] });
                }
                userWallet.balance += rewardAmount;
                userWallet.transactions.push({
                    type: 'reward',
                    amount: rewardAmount,
                    date: new Date()
                });
                console.log(`Adding ₹${rewardAmount} to wallet of user ${topScorer.userId}`);
                await userWallet.save({ session });
                await session.commitTransaction();
                console.log(`Reward added successfully for user ${topScorer.userId}!`);
            } catch (error) {
                console.error("Error during wallet transaction:", error);
                await session.abortTransaction();  
            } finally {
                session.endSession();
            }
        } catch (error) {
            console.error(`Error rewarding top scorer for ${GameModel.modelName}:`, error);
        }
    }
};

//Wallet Details
app.get('/allwallets', async (req, res) => {
    console.log("/allwallets API was called!");
    let token = req.headers.token;  
    if (!token) {
        console.log("No token provided!");
        return res.status(401).json({ status: "Token is missing" });
    }
    jwt.verify(token, "CharityApp", async (error, decoded) => {
        if (error) {
            console.log("JWT verification failed:", error.message);
            return res.status(403).json({ status: "Invalid Token", error: error.message });
        }
        console.log("Token Verified! User:", decoded.email);
        try {
            console.log("🔍 Fetching all wallets...");
            const wallets = await walletModel.find().populate('userId', 'name username email phone');
            if (!wallets.length) {
                console.log("No wallets found!");
                return res.status(404).json({ status: "No wallets found" });
            }
            console.log("Wallets Retrieved:", JSON.stringify(wallets, null, 2));
            res.json(wallets);
        } catch (error) {
            console.error("Error fetching wallets:", error);
            res.status(500).json({ status: "Internal Server Error" });
        }
    });
});

//Claim Reward
app.post("/claimreward", async (req, res) => {
    const { userId, upiId } = req.body;
    const rewardAmount = 30; 
    if (!userId || !upiId) {
      return res.status(400).json({ message: "User ID and UPI ID are required" });
    }
    try {
      const wallet = await walletModel.findOne({ userId });
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      if (wallet.balance < rewardAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      wallet.balance -= rewardAmount;
      await wallet.save();
      await rewardModel.create({ userId, upiId, amount: rewardAmount });
      return res.status(200).json({ message: "Reward Granted Successfully!" });
    } catch (error) {
      console.error("Error processing reward:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

// Configure Brevo API Key
const brevoApiKey = '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';
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = brevoApiKey;

// Make Payment 
app.post("/makepayment", async (req, res) => {
    const { postId, amount, method } = req.body;
    console.log("🔍 Received Payment Request:", req.body);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: "Error", message: "Token is missing! Unauthorized access" });
    }
    const decoded = jwt.verify(token, "CharityApp");
    const userId = decoded.userId; 
    if (!postId || !Mongoose.Types.ObjectId.isValid(postId)) {
        console.log("Invalid Post ID:", postId);
        return res.status(400).json({ status: "Failed", message: "Invalid or missing Post ID" });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
        console.log("Invalid Amount:", amount);
        return res.status(400).json({ status: "Failed", message: "Invalid or missing amount" });
    }
    if (!method) {
        console.log(" Missing Payment Method:", method);
        return res.status(400).json({ status: "Failed", message: "Payment method is required" });
    }
    try {
        const post = await postModel.findById(postId);
        if (!post) {
            console.log("Post Not Found:", postId);
            return res.status(404).json({ status: "Failed", message: "Post not found" });
        }
        if (post.currentDonationsReceived + Number(amount) > post.requiredAmount) {
            return res.status(400).json({
                status: "Failed",
                message: "Donation exceeds required amount. Try a smaller amount."
            });
        }
        const payment = await paymentModel.create({
            userId,  
            postId,
            amount,
            method,
            status: 'pending'
        });
        console.log("Payment Created Successfully:", payment);
        return res.status(200).json({
            status: "Success",
            message: "Payment Initiated Successfully",
            paymentId: payment._id
        });
    } catch (error) {
        console.error("Payment Error:", error);
        return res.status(500).json({
            status: "Failed",
            message: "Payment Failed",
            error: error.message
        });
    }
});

// Process Payment 
app.post("/processpayment", async (req, res) => {
    const { paymentId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            status: "Error",
            message: "Token is missing! Unauthorized access"
        });
    }
    try {
        const decoded = jwt.verify(token, "CharityApp");
        const payment = await paymentModel.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                status: "Error",
                message: "Payment not found!"
            });
        }
        if (payment.status === "success") {
            return res.status(200).json({
                status: "Success",
                message: "Payment already processed!"
            });
        }
        const post = await postModel.findById(payment.postId);
        if (!post) {
            return res.status(404).json({
                status: "Error",
                message: "Post not found!"
            });
        }
        if (post.currentDonationsReceived + Number(payment.amount) > post.requiredAmount) {
            return res.status(400).json({
                status: "Error",
                message: "Donation target already reached or this payment exceeds the required amount."
            });
        }
        payment.status = "success";
        await payment.save();
        post.currentDonationsReceived += Number(payment.amount);
        if (post.currentDonationsReceived >= post.requiredAmount) {
            post.currentDonationsReceived = post.requiredAmount;
            post.status = 'approved';
        }
        await post.save();
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        page.drawText('Payment Receipt', {
            x: 200,
            y: height - 50,
            size: 20,
            font,
            color: rgb(0, 0, 0)
        });
        page.drawText(`Transaction ID: ${payment._id}`, { x: 50, y: height - 100, size: fontSize, font });
        page.drawText(`Amount Paid: INR ${payment.amount}`, { x: 50, y: height - 120, size: fontSize, font });
        page.drawText(`Payment Method: ${payment.method}`, { x: 50, y: height - 140, size: fontSize, font });
        page.drawText(`Payment Status: ${payment.status}`, { x: 50, y: height - 160, size: fontSize, font });
        page.drawText(`Date & Time: ${new Date(payment.createdAt).toLocaleString()}`, { x: 50, y: height - 180, size: fontSize, font });
        const pdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(pdfBytes);
        res.status(200).json({
            status: "Success",
            message: "Payment successfully processed! Receipt will be sent via email.",
            paymentId: payment._id
        });
        try {
            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
            sendSmtpEmail.subject = "Payment Receipt - Thank You for Your Donation!";
            sendSmtpEmail.htmlContent = `
                <h3>Dear Donor,</h3>
                <p>Thank you for your generous donation of ₹${payment.amount}.</p>
                <p>Please find the attached payment receipt for your reference.</p>
                <p><strong>Transaction ID:</strong> ${payment._id}</p>
                <p><strong>Payment Method:</strong> ${payment.method}</p>
                <p><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleString()}</p>
                <p>We sincerely appreciate your support.</p>
                <br>
                <p>Regards,</p>
                <p><strong>CharityApp Team</strong></p>
            `;
            sendSmtpEmail.sender = { name: "CharityApp", email: "charityapp2025@gmail.com" };
            sendSmtpEmail.to = [{ email: decoded.email }];

            sendSmtpEmail.attachment = [{
                content: pdfBuffer.toString('base64'),
                name: `Receipt_${payment._id}.pdf`
            }];
            await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log(`Email sent successfully to ${decoded.email}`);
        } catch (emailError) {
            console.error("Email Sending Error:", emailError);
        }
    } catch (error) {
        console.error("Payment Processing Error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Failed to process payment. Something went wrong."
        });
    }
});

//Download Receipt
app.post("/downloadreceipt", async (req, res) => {
    let { paymentId } = req.body;
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Token Missing!");
    try {
        const decoded = jwt.verify(token, "CharityApp");
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) return res.status(404).send("User Not Found");
        const payment = await paymentModel.findById(paymentId);
        if (!payment) return res.status(404).send("Payment Not Found");
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        page.drawText('Payment Receipt', {
            x: 200,
            y: height - 50,
            size: 20,
            font,
            color: rgb(0, 0, 0)
        });
        page.drawText(`Transaction ID: ${payment._id}`, { x: 50, y: height - 100, size: fontSize, font });
        page.drawText(`Amount Paid: INR ${payment.amount}`, { x: 50, y: height - 120, size: fontSize, font }); // Avoid ₹
        page.drawText(`Payment Method: ${payment.method}`, { x: 50, y: height - 140, size: fontSize, font });
        page.drawText(`Payment Status: ${payment.status}`, { x: 50, y: height - 160, size: fontSize, font });
        page.drawText(`Date & Time: ${new Date(payment.createdAt).toLocaleString()}`, { x: 50, y: height - 180, size: fontSize, font });
        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Receipt_${payment._id}.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error("Failed to download receipt:", error);
        res.status(500).send("Failed to download receipt");
    }
});

//Get User Payment History
app.post("/getuserpayment", async (req, res) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: "Error", message: "Token is missing" });
    }
    try {
        const decoded = jwt.verify(token, "CharityApp");
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ status: "Error", message: "User not found" });
        const payments = await paymentModel.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Failed to fetch payments" });
    }
});

//-----------------------------------------------------SOCIAL WORKER DASHBOARD------------------------------------------------------------------

//Add Post
const storage = multer.diskStorage({               
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post("/addpost", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ status: "Error", message: "Token is missing" });
    try {
        const decoded = jwt.verify(token, "CharityApp");
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ status: "Error", message: "Failed to upload file" });
            }
            const { title, description, requiredAmount, name, age, location, contact, purpose, accountName, accountNo, ifsc, bankName } = req.body;
            if (!title || !description || !requiredAmount || !name || !age || !location || !contact) {
                return res.status(400).json({ status: "Error", message: "All fields are required" });
            }
            const filePath = req.file ? req.file.path : null;
            const documentType = req.file && req.file.mimetype.startsWith('image/') ? 'image' : 'document';
            const newPost = new postModel({
                title,
                description,
                requiredAmount,
                image: filePath,
                documentType,
                postedBy: decoded.email,
                name,
                age,
                location,
                contact,
                purpose,
                accountName,
                accountNo,
                ifsc,
                bankName,
                status: 'pending'  
            });
            await newPost.save();
            res.status(200).json({ status: "Success", message: "Post added successfully. Waiting for admin approval." });
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to add post", error: error.message });
    }
});



//Get Social Worker Posts
app.post('/getSocialWorkerPosts', async (req, res) => {
    const { email } = req.body; 
    try {
      const posts = await postModel.find({ createdBy: email });
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: 'No posts found' });
      }
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

//Approved Posts
app.post("/approvedposts", async (req, res) => {
    try {
        const posts = await postModel.find({ status: "approved" });
        const openForDonations = posts.filter(post => 
            parseFloat(post.requiredAmount) > parseFloat(post.collectedAmount || 0)
        );
        res.json(openForDonations);
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to fetch approved posts" });
    }
});


//Rejected Posts
app.post("/rejectedposts", async (req, res) => {
    try {
        const posts = await postModel.find({ status: "rejected" });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to fetch rejected posts" });
    }
});

//Delete Posts
app.post('/deletePost', async (req, res) => {
    const { postId } = req.body; 
    try {
        const deletedPost = await postModel.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: ' Post not found' });
        }
        res.json({ message: ' Post deleted successfully' });
    } catch (error) {
        console.error(' Error deleting post:', error);
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

//Edit Post
app.post('/editPost', async (req, res) => {
    const { postId, requiredAmount } = req.body; 
    try {
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { requiredAmount },
            { new: true } 
        );
        if (!updatedPost) {
            return res.status(404).json({ message:  'Post not found' });
        }
        res.json({ message: 'Amount updated successfully', updatedPost });
    } catch (error) {
        console.error('Error updating amount:', error);
        res.status(500).json({ message: 'Failed to update amount' });
    }
});

//View Reports
app.post("/viewreports", async (req, res) => {
    try {
        const postReports = await postModel.find(
            {},
            { title: 1, requiredAmount: 1, currentDonationsReceived: 1, createdAt: 1 }
        );
        res.status(200).json({
            postReports
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

//Add Announcement
app.post("/addAnnouncement", async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }
        const newAnnouncement = new announcementModel({ topic });
        await newAnnouncement.save();
        res.status(201).json({ message: "Announcement added successfully", announcement: newAnnouncement });
    } catch (error) {
        console.error("Error adding announcement:", error);
        res.status(500).json({ message: "Failed to add announcement" });
    }
});

//Like Announcement
app.post("/likeAnnouncement", async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: "Announcement ID is required" });
      }
      const updatedAnnouncement = await announcementModel.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
      if (!updatedAnnouncement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(200).json({ message: "Announcement liked", likes: updatedAnnouncement.likes });
    } catch (error) {
      console.error("Error liking announcement:", error);
      res.status(500).json({ message: "Failed to like announcement" });
    }
  });  

//Get Announcement
app.get("/getAnnouncements", async (req, res) => {
    try {
        const announcements = await announcementModel.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Failed to fetch announcements" });
    }
});

//Delete Announcement
app.post("/deleteAnnouncement", async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Announcement ID is required" });
        }
        const deletedAnnouncement = await announcementModel.findByIdAndDelete(id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ message: "Failed to delete announcement" });
    }
});

//Add Emergency
const flaggedWords = ["fake", "scam", "test", "hoax", "spam", "fraud"]; 
const FLAGGED_THRESHOLD = 3; 

app.post("/addemergency", async (req, res) => {
    try {
        const { title, description, location, alertType, ward_no } = req.body;
        if (!title || !description || !location || !alertType || !ward_no) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        const alertText = `${title} ${description} ${location}`.toLowerCase();
        let flaggedCount = flaggedWords.filter(word => alertText.includes(word)).length;
        if (flaggedCount >= FLAGGED_THRESHOLD) {
            return res.status(403).json({ message: "Your alert was flagged as potential spam and was not added!" });
        }
        const newAlert = new emergencyModel({
            title,
            description,
            location,
            alertType,
            ward_no
        });
        await newAlert.save();
        res.status(201).json({ message: "Emergency alert reported!", alert: newAlert });
    } catch (error) {
        console.error("Your alert was flagged as potential spam and was not added!:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//View Emergency
app.get("/getemergency", async (req, res) => {
        try {
            const emergency = await emergencyModel.find().sort({ createdAt: -1 });
            res.status(200).json(emergency);
        } catch (error) {
            console.error("Error fetching emergency:", error);
            res.status(500).json({ message: "Failed to fetch emergency" });
        }
    });
    
//Like Emergency 
app.post("/reportemergency", async (req, res) => {
    try {
        const { id } = req.body;
        const alert = await emergencyModel.findById(id);
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        alert.reports = (alert.reports || 0) + 1; 
        if (alert.reports >= 5) {
            await emergencyModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Alert removed due to multiple reports!" });
        } else {
            await alert.save();
            return res.status(200).json({ message: "Alert reported!", alert });
        }
    } catch (error) {
        console.error(" Error reporting alert:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//Alert Email
const sendEmergencyAlertEmail = async (alert, users, ward_no) => {
    try {
        const wardNoAsString = String(ward_no);
        const usersInSameWard = users.filter(user => String(user.ward_no) === wardNoAsString);
        console.log(`Found ${usersInSameWard.length} users in ward ${ward_no}`);
        if (usersInSameWard.length === 0) {
            console.log("No users found in this ward.");
            return;
        }
        const emailContent = `
            <h3>Dear Resident,</h3>
            <p>We are writing to inform you about an urgent situation in your area.</p>
            <p><strong>Alert:</strong> ${alert.title}</p>
            <p><strong>Description:</strong> ${alert.description}</p>
            <p><strong>Date:</strong> ${new Date(alert.createdAt).toLocaleString()}</p>
            <p>We urge you to take the necessary precautions and stay safe.</p>
            <br>
            <p>Regards,</p>
            <p><strong>Your Charity App Team</strong></p>
        `;
        for (const user of usersInSameWard) {
            try {
                const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
                sendSmtpEmail.subject = `Urgent: Emergency Alert for Your Ward – ${alert.title}`;
                sendSmtpEmail.htmlContent = emailContent;
                sendSmtpEmail.sender = { name: "CharityApp", email: "charityapp2025@gmail.com" };
                sendSmtpEmail.to = [{ email: user.email }];
                console.log(`Sending email to: ${user.email}`);
                const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
                console.log("Email Response:", response);
                if (response && response.messageId) {
                    console.log(`Email successfully sent to ${user.email} with messageId: ${response.messageId}`);
                } else {
                    console.log(`Failed to send email to ${user.email}:`, response);
                }
            } catch (emailError) {
                console.error(`Error sending email to ${user.email}:`, emailError);
            }
        }
    } catch (error) {
        console.error("Error in sendEmergencyAlertEmail:", error);
    }
}
  
//-----------------------------------------------------SOCIAL WORKER DASHBOARD------------------------------------------------------------------
 
//-----------------------------------------------------GAMES AND LEADERSHIP---------------------------------------------------------------------

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!QUIZ
app.post("/api/saveQuizScore", async (req, res) => {
    try {
        const { score } = req.body;
        console.log("Received score:", score); 
        if (score === undefined || score === null) {
            return res.status(400).json({ message: "Score is required!" });
        }
        if (typeof score !== "number") {
            return res.status(400).json({ message: "Invalid score type. Must be a number!" });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "Error", message: "Token missing or invalid!" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, "CharityApp");
        } catch (error) {
            return res.status(401).json({ status: "Error", message: "Invalid or expired token!" });
        }
        const userId = decoded.userId;
        console.log("Storing score:", score, "for user:", userId);
        const newQuiz = new quizModel({ userId, score });
        await newQuiz.save();
        console.log("Saved score in DB:", newQuiz.score); 
        res.status(201).json({ message: "Quiz score saved successfully!", newQuiz });
    } catch (error) {
        console.error("Error saving quiz score:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/api/getUserQuizScores", async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ status: "Error", message: "Invalid or missing token! Unauthorized access" });
        }
        const decoded = jwt.verify(token.split(" ")[1], "CharityApp");
        const userId = decoded.userId; 
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const scores = await quizModel.find({ userId }).sort({ createdAt: -1 });
        res.json(scores);
    } catch (error) {
        console.error("Error fetching user quiz scores:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/api/getQuizLeader", async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); 
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); 
        const quizLeaderboard = await quizModel
            .find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }) 
            .populate("userId", "username") 
            .sort({ score: -1, createdAt: 1 }) 
            .limit(10); 
        res.json({ quizLeaderboard });
    } catch (error) {
        console.error("Error fetching quiz leaderboard:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!GUESS THE NUMBER
app.post("/api/saveGuessTheNumberScore", async (req, res) => {
    try {
        const { scores } = req.body;  
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "Error", message: "Token is missing or invalid!" });
        }
        const token = authHeader.split(" ")[1]; 
        let decoded;
        try {
            decoded = jwt.verify(token, "CharityApp");
        } catch (error) {
            return res.status(401).json({ status: "Error", message: "Invalid or expired token!" });
        }
        const userId = decoded.userId; 
        if (!scores) {
            return res.status(400).json({ message: "Scores are required" });
        }
        const newGame = new guessTheNumberModel({ userId, score: scores });  
        await newGame.save();
        res.status(201).json({ message: "Game score saved successfully", newGame });
    } catch (error) {
        console.error("Error saving game score:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/api/getUserScores", async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ status: "Error", message: "Invalid or missing token! Unauthorized access" });
        }
        const decoded = jwt.verify(token.split(" ")[1], "CharityApp");
        const userId = decoded.userId; 
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const scores = await guessTheNumberModel.find({ userId }).sort({ createdAt: -1 });
        res.json(scores);
    } catch (error) {
        console.error("Error fetching user scores:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/api/getGuessTheNumberLeader", async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); 
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); 
        const guessTheNumberLeader = await guessTheNumberModel
            .find({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
            .populate("userId", "username")
            .sort({ score: 1 }) 
            .limit(10); 
        res.json({ guessTheNumberLeader });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!TIC TAC TOE
app.post("/api/saveTicTacToeScore", async (req, res) => {
    try {
        console.log("🔹 Request received to save score");
        const { score } = req.body;
        console.log("Score received:", score); 
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("Token missing or invalid!");
            return res.status(401).json({ status: "Error", message: "Token is missing or invalid!" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, "CharityApp"); 
        } catch (error) {
            console.log("Invalid token!", error);
            return res.status(401).json({ status: "Error", message: "Invalid or expired token!" });
        }
        const userId = decoded.userId;
        console.log("User ID:", userId);
        if (!userId) {
            return res.status(400).json({ status: "Error", message: "User ID is missing in token!" });
        }
        if (score === undefined || isNaN(score)) {
            console.log("Invalid score received!");
            return res.status(400).json({ message: "Score is required and must be a number" });
        }
        const newGame = new ticTacToeModel({ userId, score: parseInt(score) });
        await newGame.save();
        console.log("Score saved to MongoDB:", newGame);
        res.status(201).json({ message: "Tic Tac Toe score saved successfully", newGame });
    } catch (error) {
        console.error("Error saving Tic Tac Toe score:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/api/getUserTicTacToeScores", async (req, res) => {
    try {
        const { token } = req.body; 
        if (!token) {
            return res.status(401).json({ status: "Error", message: "Token is missing!" });
        }
        const decoded = jwt.verify(token, "CharityApp");
        const userId = decoded.userId;
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const scores = await ticTacToeModel.find({ userId }).sort({ createdAt: -1 });
        res.json(scores);
    } catch (error) {
        console.error("Error fetching Tic Tac Toe scores:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/api/getTicTacToeLeader", async (req, res) => {
    try {
        const { date } = req.body; 
        const startOfDay = date ? new Date(date) : new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
        const leaderboard = await ticTacToeModel
            .find({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
            .populate("userId", "username") 
            .sort({ score: -1, createdAt: 1 }) 
            .limit(10);
        res.json({ leaderboard });
    } catch (error) {
        console.error("Error fetching Tic Tac Toe leaderboard:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SNAKE GAME
app.post("/api/saveSnakeGameScore", async (req, res) => {
    try {
        console.log("🔹 Request received to save Snake Game score"); 
        console.log(" Request Body:", req.body);  
        const { score } = req.body;
        if (score === undefined || isNaN(score)) {
            console.log("Invalid score received!");
            return res.status(400).json({ message: "Score is required and must be a number" });
        }
        console.log("Score received:", score);
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("Token missing or invalid!");
            return res.status(401).json({ status: "Error", message: "Token is missing or invalid!" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, "CharityApp"); 
            console.log("Token decoded:", decoded);
        } catch (error) {
            console.log("Invalid token!", error);
            return res.status(401).json({ status: "Error", message: "Invalid or expired token!" });
        }
        const userId = decoded.userId;
        console.log("User ID:", userId);
        if (!userId) {
            return res.status(400).json({ status: "Error", message: "User ID is missing in token!" });
        }
        const newGame = new snakeGameModel({ userId, score: parseInt(score) });
        await newGame.save();
        console.log("Snake Game score saved to MongoDB:", newGame);
        res.status(201).json({ message: "Snake Game score saved successfully", newGame });
    } catch (error) {
        console.error("Error saving Snake Game score:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/api/getUserSnakeScores", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ status: "Error", message: "Token is missing!" });
        }
        const decoded = jwt.verify(token, "CharityApp");
        const userId = decoded.userId;
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const scores = await snakeGameModel.find({ userId }).sort({ createdAt: -1 });
        res.json(scores);
    } catch (error) {
        console.error("Error fetching Snake Game scores:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/api/getSnakeLeader", async (req, res) => {
    try {
        const { date } = req.body; 
        const startOfDay = date ? new Date(date) : new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
        const leaderboard = await snakeGameModel
            .find({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
            .populate("userId", "username") 
            .sort({ score: -1, createdAt: 1 }) 
            .limit(10);
        res.json({ leaderboard });
    } catch (error) {
        console.error("Error fetching Snake Game leaderboard:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!HANGMAN GAME
app.post("/api/saveHangmanScore", async (req, res) => {
    try {
        console.log("🔹 Request received to save Hangman score");
        const { score } = req.body; 
        console.log("Request Body:", req.body);
        if (score === undefined || isNaN(score)) {
            console.log("Invalid score received!");
            return res.status(400).json({ message: "Score is required and must be a number" });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("Token missing or invalid!");
            return res.status(401).json({ status: "Error", message: "Token is missing or invalid!" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, "CharityApp");
            console.log("Token decoded:", decoded);
        } catch (error) {
            console.log("Invalid token!", error);
            return res.status(401).json({ status: "Error", message: "Invalid or expired token!" });
        }
        const userId = decoded.userId;
        console.log("User ID:", userId);
        if (!userId) {
            return res.status(400).json({ status: "Error", message: "User ID is missing in token!" });
        }
        const newGame = new hangmanModel({ userId, score: parseInt(score) });
        await newGame.save();
        console.log("Hangman Game score saved to MongoDB:", newGame);
        res.status(201).json({ message: "Hangman Game score saved successfully", newGame });
    } catch (error) {
        console.error("Error saving Hangman Game score:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/api/getUserHangmanScores", async (req, res) => {
    try {
        const { token } = req.body; 
        if (!token) {
            return res.status(401).json({ status: "Error", message: "Token is missing!" });
        }
        const decoded = jwt.verify(token, "CharityApp");
        const userId = decoded.userId;
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const scores = await hangmanModel.find({ userId }).sort({ createdAt: -1 });
        res.json(scores);
    } catch (error) {
        console.error("Error fetching Hangman scores:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/api/getHangmanLeader", async (req, res) => {
    try {
        const { date } = req.body; 
        const startOfDay = date ? new Date(date) : new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
        const leaderboard = await hangmanModel
            .find({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
            .populate("userId", "username")
            .sort({ scores: 1, createdAt: 1 }) 
            .limit(10);
        res.json({ leaderboard });
    } catch (error) {
        console.error("Error fetching Hangman leaderboard:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//-----------------------------------------------------GAMES AND LEADERSHIP---------------------------------------------------------------------

app.listen(3030, () =>{
    console.log("Server Started")
})
