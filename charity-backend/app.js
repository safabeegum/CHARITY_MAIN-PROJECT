const Express = require("express"); // Capitalized Express
const Mongoose = require("mongoose");
const Cors = require("cors");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const nodemailer = require('nodemailer');
const fs = require('fs');

const userModel = require("./models/users");
const adminModel = require("./models/admin");
const socialworkersModel = require("./models/socialworkers");
const reviewModel = require("./models/review");
const paymentModel = require("./models/payment");

let app = Express(); // Capitalized Express Initialization

app.use(Express.json()); // Capitalized Express Middleware
app.use(Cors()); // Capitalized Cors Middleware

Mongoose.connect("mongodb+srv://safabeegum:mongodb24@cluster0.pbzbbey.mongodb.net/CharityApp?retryWrites=true&w=majority&appName=Cluster0")




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
        const reportsCount = await reviewModel.countDocuments(); // Assuming reports are stored in reviewModel
        const feedbackCount = await reviewModel.countDocuments(); // Assuming feedback is stored in reviewModel

        res.json({
            users: usersCount,
            socialWorkers: socialWorkersCount,
            reports: reportsCount,
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

/* Route for Changing Password (Hashes the new password)
app.post("/changepassword", async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        let user = await socialworkersModel.findById(userId);

        if (!user) {
            return res.json({ "status": "User Not Found" });
        }

        let passwordMatches = bcrypt.compareSync(oldPassword, user.password);
        if (!passwordMatches) {
            return res.json({ "status": "Incorrect Old Password" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await socialworkersModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

        res.json({ "status": "Password Changed Successfully" });

    } catch (error) {
        res.json({ "status": "Error", "error": error.message });
    }
});*/


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
    let { amount, method } = req.body;
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ status: "Error", message: "Token is missing" });

    try {
        const decoded = jwt.verify(token, "CharityApp");
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) return res.status(404).json({ status: "Error", message: "User not found" });

        const payment = new paymentModel({
            userId: user._id,
            amount,
            method,
            status: "pending",
        });

        await payment.save();
        res.json({ status: "Success", message: "Payment initiated", paymentId: payment._id });

    } catch (error) {
        res.status(401).json({ status: "Error", message: "Invalid Token" });
    }
});

//Process Payment
app.post("/processpayment", async (req, res) => {
    let { paymentId } = req.body;
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ status: "Error", message: "Token is missing" });

    try {
        const decoded = jwt.verify(token, "CharityApp");
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) return res.status(404).json({ status: "Error", message: "User not found" });

        const payment = await paymentModel.findById(paymentId);
        if (!payment) return res.status(404).json({ status: "Error", message: "Payment not found" });

        // ✅ Mark Payment As Success
        payment.status = "success";
        await payment.save();

        // ✅ NOW GENERATE PDF IN-MEMORY WITHOUT STORING 💯🔥
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);

        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.setFont(font);

        // ✅ Add Receipt Heading
        page.drawText('Payment Receipt', { x: 220, y: height - 50, size: 20 });

        // ✅ Add Payment Details
        page.drawText(`Transaction ID: ${payment._id}`, { x: 50, y: height - 100 });
        page.drawText(`Amount Paid: Rs. ${payment.amount}`, { x: 50, y: height - 130 });  // 👈 Removed ₹ Symbol
        page.drawText(`Payment Method: ${payment.method}`, { x: 50, y: height - 160 });
        page.drawText(`Payment Status: ${payment.status}`, { x: 50, y: height - 190 });
        page.drawText(`Date & Time: ${new Date(payment.createdAt).toLocaleString()}`, { x: 50, y: height - 220 });

        // ✅ Save PDF Buffer
        const pdfBytes = await pdfDoc.save();

        // ✅ SEND EMAIL WITH PDF ATTACHMENT 💣🔥
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'charityapp2025',
                pass: 'zagp exnp ujys fmef'
            }
        });

        const mailOptions = {
            from: 'charityapp2025',
            to: user.email,
            subject: 'Payment Receipt',
            text: 'Thank you for your payment. Please find the attached receipt.',
            attachments: [
                {
                    filename: `Receipt_${payment._id}.pdf`,
                    content: pdfBytes,
                    encoding: 'base64'
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Error sending email:", error);
                return res.status(500).json({ status: "Error", message: "Failed to send email" });
            }
            console.log("✅ Email sent:", info.response);
            res.json({ status: "Success", message: "Payment successful and receipt sent!" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Payment failed", error: error.message });
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



  
app.listen(3030, () =>{
    console.log("Server Started")
})
