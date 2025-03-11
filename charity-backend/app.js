const Express = require("express"); // Capitalized Express
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



const userModel = require("./models/users");
const adminModel = require("./models/admin");
const socialworkersModel = require("./models/socialworkers");
const reviewModel = require("./models/review");
const paymentModel = require("./models/payment");
const postModel = require('./models/post');

let app = Express(); // 

app.use(Express.json()); // Capitalized Express Middleware
app.use(Cors()); // Capitalized Cors Middleware

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
                    //create token start
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
                    //create token end
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
app.post("/login",async(req,res) => {
    let input = req.body 
    let result = userModel.find({email:req.body.email}).then(
        (items)=>{
            if(items.length>0)
            {
                const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password)
                if(passwordValidator)
                {
                    //create token start
                    jwt.sign({email:req.body.email},"CharityApp",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) 
                            {
                                res.json({"status":"Error","error":error})
                            } 
                            else 
                            {
                                res.json({"status":"Success","token":token,"userId":items[0]._id})
                            }
                        }
                    )
                    //create token end
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


//Admin Dashboard

app.post("/api/admindashboard", async (req, res) => {
    try {
      // Fetching statistics
      const usersCount = await userModel.countDocuments();
      const socialWorkersCount = await socialworkersModel.countDocuments();
      
      // Count reports that are "pending approval" (assuming the status is a field in your reviewModel)
      const pendingReportsCount = await postModel.countDocuments({ status: "pending" }); // Change "pending" to whatever status represents pending approvals in your model
  
      // Feedback count remains the same (assuming feedback has no status check)
      const feedbackCount = await reviewModel.countDocuments(); // Assuming feedback is stored in reviewModel
  
      res.json({
        users: usersCount,
        socialWorkers: socialWorkersCount,
        pendingApprovals: pendingReportsCount, // Return the count of pending approvals
        feedback: feedbackCount
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
                $match: { createdAt: { $gte: last7Days } } // Ensure createdAt is present
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Format date
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        console.log("User Activity Data:", activity); // Debugging: Check if data is retrieved

        res.json(activity.length > 0 ? activity.map(item => ({ date: item._id, count: item.count })) : []);

    } catch (error) {
        console.error("Error fetching user activity:", error);
        res.status(500).json({ status: "Error", message: "Failed to fetch user activity" });
    }
});



//Register
app.post("/register", async(req,res)=> {
    let input = req.body 
    //Hashed password
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


//Post a Review 

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

app.post("/review", async (req, res) => {
    let { review, rating } = req.body;
    let token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

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


// My Profile
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
                { email: decoded.email },  // Find user by email
                { $set: req.body },         // Update user with new data
                { new: true }               // Return updated document
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


//Social Workers Login

app.post("/socialworkerslogin", async (req, res) => {
    try {
        let user = await socialworkersModel.findOne({ email: req.body.email });

        if (!user) {
            return res.json({ "status": "Invalid Email ID" });
        }

        let passwordMatches = false;

        // Check if the stored password is hashed or plain text
        if (user.password.startsWith("$2b$")) { // bcrypt hashed passwords start with "$2b$"
            passwordMatches = bcrypt.compareSync(req.body.password, user.password);
        } else {
            passwordMatches = req.body.password === user.password;
        }

        if (passwordMatches) {
            // Create token
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

app.post("/retrievesocialworkers", async (req, res) => {
    let token = req.headers.authorization?.split(" ")[1]; //  Extract token from "Bearer <token>"
  
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
        const users = await socialworkersModel.find({}, "-password"); // Exclude password for security
        console.log(`Retrieved ${users.length} social workers successfully.`);
        return res.json(users);
      } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: "Error fetching users", error: err.message });
      }
    });
  });

  
  // Make Payment

  app.post("/makepayment", async (req, res) => {
    const { userId, postId, amount, method } = req.body;

    try {
        // ✅ Step 1: Create Payment Entry in MongoDB 💸
        const payment = await paymentModel.create({
            userId,
            postId,
            amount,
            method,
            status: 'pending'  // ✅ Initially keep it 'pending' until processed
        });

        // ✅ Step 2: Find the Post Where Payment Was Made
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ status: "Failed", message: "Post not found" });
        }

        // ✅ Step 3: Add The Amount To Collected Donations 💰
        post.currentDonationsReceived += Number(amount);

        // ✅ Step 4: Check If Target Amount is Reached, Auto-Approve Post 💸
        if (post.currentDonationsReceived >= post.requiredAmount) {
            post.status = 'approved';  // ✅ Auto-Approve if donation goal is met
        }

        // ✅ Step 5: Save Post Update in MongoDB 💾
        await post.save();

        // ✅ Step 6: Return Payment Success Response Along with Payment ID 💯
        return res.status(200).json({
            status: "Success",
            message: "Payment Initiated Successfully",
            paymentId: payment._id
        });

    } catch (error) {
        console.error("❌ Payment Error:", error);
        return res.status(500).json({
            status: "Failed",
            message: "Payment Failed",
            error: error.message
        });
    }
});




//Process Payment

const brevoApiKey = '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';
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = brevoApiKey;

app.post("/processpayment", async (req, res) => {
    const { paymentId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    // ✅ Step 1: Check Token
    if (!token) {
        return res.status(401).json({
            status: "Error",
            message: "Token is missing! Unauthorized access"
        });
    }

    try {
        // ✅ Step 2: Verify Token
        const decoded = jwt.verify(token, "CharityApp");

        // ✅ Step 3: Find Payment
        const payment = await paymentModel.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                status: "Error",
                message: "Payment not found!"
            });
        }

        // ✅ Step 4: Check If Payment Already Processed
        if (payment.status === "success") {
            return res.status(200).json({
                status: "Success",
                message: "Payment already processed!"
            });
        }

        // ✅ Step 5: Find Related Post
        const post = await postModel.findById(payment.postId);
        if (!post) {
            return res.status(404).json({
                status: "Error",
                message: "Post not found!"
            });
        }

        // ✅ Step 6: Mark Payment as Success
        payment.status = "success";
        await payment.save();

        // ✅ Step 7: Add Donation to Post
        post.currentDonationsReceived += Number(payment.amount);
        if (post.currentDonationsReceived >= post.requiredAmount) {
            post.status = 'approved';
        }
        await post.save();

        // ✅ Step 8: Generate PDF Receipt Using pdf-lib
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // ✅ Add Text To PDF
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

        // ✅ Convert PDF to Buffer
        const pdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(pdfBytes);

        // ✅ Step 9: Send Email Using Brevo
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

        // ✅ Attach the PDF Receipt
        sendSmtpEmail.attachment = [{
            content: pdfBuffer.toString('base64'),
            name: `Receipt_${payment._id}.pdf`
        }];

        // ✅ Send Email
        await apiInstance.sendTransacEmail(sendSmtpEmail);

        // ✅ Return Success Response
        return res.status(200).json({
            status: "Success",
            message: "Payment successfully processed & receipt emailed!",
            paymentId: payment._id
        });

    } catch (error) {
        console.error("❌ Payment Processing Error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Failed to process payment. Something went wrong."
        });
    }
});
  



// ✅ 2. DOWNLOAD RECEIPT API 🚀💯🔥
app.post("/downloadreceipt", async (req, res) => {
    let { paymentId } = req.body;
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).send("Token Missing!");

    try {
        // ✅ Verify token
        const decoded = jwt.verify(token, "CharityApp");
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) return res.status(404).send("User Not Found");

        // ✅ Find the payment
        const payment = await paymentModel.findById(paymentId);
        if (!payment) return res.status(404).send("Payment Not Found");

        // ✅ Generate PDF in-memory
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // ✅ Add text to the PDF
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

        // ✅ Convert PDF to Bytes
        const pdfBytes = await pdfDoc.save();

        // ✅ Send PDF to the user as a download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Receipt_${payment._id}.pdf`);
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error("Failed to download receipt:", error);
        res.status(500).send("Failed to download receipt");
    }
});



// ✅ GET USER PAYMENT HISTORY USING POST 💣🔥
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



//Add Post

// ✅ Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// ✅ ADD POST API (WITHOUT ROUTER 💯)
app.post("/addpost", (req, res) => {
    // ✅ Upload File without Overwriting Body
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ status: "Error", message: "Failed to upload file" });
        }

        // ✅ Get All Form Data from React
        const { 
            title, description, requiredAmount, 
            name, age, location, contact, 
            purpose, accountName, accountNo, ifsc, bankName 
        } = req.body;

        // ✅ Check Required Fields
        if (!title || !description || !requiredAmount || !name || !age || !location || !contact) {
            return res.status(400).json({ status: "Error", message: "All fields are required" });
        }

        // ✅ Handle File Path
        const filePath = req.file ? req.file.path : null;
        const documentType = req.file && req.file.mimetype.startsWith('image/') ? 'image' : 'document';

        // ✅ 🚀 Save Data in MongoDB
        const newPost = new postModel({
            title,
            description,
            requiredAmount,
            image: filePath,
            documentType,
            name,
            age,
            location,
            contact,
            purpose,
            accountName,
            accountNo,
            ifsc,
            bankName,
            status: 'pending'  // ✅ Automatically set as PENDING
        });

        // ✅ Save in MongoDB
        await newPost.save();
        res.status(200).json({ status: "Success", message: "Post added successfully. Waiting for admin approval." });
    });
});


app.post('/getSocialWorkerPosts', async (req, res) => {
    const { email } = req.body; // Retrieve the email from the POST body
  
    try {
      // Find posts created by the social worker with the given email
      const posts = await postModel.find({ createdBy: email });
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: 'No posts found' });
      }
  
      res.json(posts);
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  

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
        // ✅ Hardcoded admin email for testing
        const email = 'admin@gmail.com';  // Hardcoded admin email for testing

        // ✅ Directly approve or reject the post without checking role
        if (action === 'approve') {
            await postModel.findByIdAndUpdate(postId, { status: 'approved' });
            return res.json({ message: "✅ Post approved successfully" });
        }

        if (action === 'reject') {
            await postModel.findByIdAndUpdate(postId, {
                status: 'Rejected',
                rejectionReason
            });
            return res.json({ message: "❌ Post rejected successfully" });
        }

    } catch (error) {
        res.status(500).json({ message: "Failed to approve/reject post" });
    }
});





//Approved Posts
app.post("/approvedposts", async (req, res) => {
    try {
        const posts = await postModel.find({ status: "approved" });

        // ✅ Filter only posts where the target amount is not reached
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



  
app.listen(3030, () =>{
    console.log("Server Started")
})
