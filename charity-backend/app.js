const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")
const adminModel = require("./models/admin")
const socialworkersModel = require("./models/socialworkers")
const reviewModel = require("./models/review")

let app = Express()

app.use(Express.json())
app.use(Cors())

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
  
  
app.listen(3030, () =>{
    console.log("Server Started")
})
