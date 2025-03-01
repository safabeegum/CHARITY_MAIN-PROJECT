import axios from 'axios';
import React, { useState } from 'react';
import Nav from './Nav';

const Register = () => {
    const [input, setInput] = useState({
        name: "",
        username: "", 
        address: "", 
        email: "",  
        phone: "", 
        ward_no: "", 
        ward_name: "",
        password: "",
        confirmpass: "",
    });

    const inputHandler = (event) => {
        const { name, value } = event.target;
        
        // Allow only 10-digit numeric input for phone
        if (name === "phone") {
            if (!/^\d*$/.test(value)) return; // Prevent non-numeric input
            if (value.length > 10) return; // Restrict input to 10 digits
        }

        setInput({ ...input, [name]: value });
    };

    const readValue = async (event) => {
        event.preventDefault(); 

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Phone number validation (must be exactly 10 digits)
        const phoneRegex = /^\d{10}$/;
        // Password validation: Minimum 6 characters, at least 1 digit, and 1 special character
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;

        // Check for empty fields
        for (let key in input) {
            if (input[key].trim() === "") {
                alert(`Please fill in the ${key.replace("_", " ").toUpperCase()} field.`);
                return;
            }
        }

        // Validation checks
        if (!emailRegex.test(input.email)) {
            alert("Please enter a valid email address!");
            return;
        }

        if (!phoneRegex.test(input.phone)) {
            alert("Please enter a valid 10-digit phone number!");
            return;
        }

        if (!passwordRegex.test(input.password)) {
            alert("Password must be at least 6 characters, include 1 digit, and 1 special character!");
            return;
        }

        if (input.password !== input.confirmpass) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3030/register", input);
            console.log(response.data);
            if (response.data.status === 'Success') {
                alert("Registered Successfully!!!");
                setInput({ 
                    name: "",
                    username: "", 
                    address: "", 
                    email: "",  
                    phone: "", 
                    ward_no: "", 
                    ward_name: "",
                    password: "", 
                    confirmpass: ""
                });
            } else {
                alert("Email ID Already Exists!!!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("There was an error processing your request.");
        }
    };

    return (
        <div>
            <Nav/>
        
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card border-light mb-3">
                            <img src="https://static.vecteezy.com/system/resources/previews/016/900/444/non_2x/online-dating-app-login-illustration-valentine-s-day-love-match-mobile-leaves-gradient-character-illustration-vector.jpg" className="card-img-top" alt="Sign Up" />
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                    <br></br>
                        <div className="card border-light mb-3">
                            <div className="row g-3">
                                <div className="col-6">
                                    <label className="form-label">NAME</label>
                                    <input type="text" className="form-control" name='name' value={input.name} onChange={inputHandler} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">USERNAME</label>
                                    <input type="text" className="form-control" name='username' value={input.username} onChange={inputHandler} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">ADDRESS</label>
                                    <textarea name="address" className="form-control" value={input.address} onChange={inputHandler}></textarea>
                                </div>
                                <div className="col-6">
                                    <label className="form-label">EMAIL</label>
                                    <input type="text" className="form-control" name='email' value={input.email} onChange={inputHandler} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">CONTACT NUMBER</label>
                                    <input type="text" className="form-control" name='phone' maxLength="10" value={input.phone} onChange={inputHandler} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">WARD NUMBER</label>
                                    <select name="ward_no" className="form-control" value={input.ward_no} onChange={inputHandler}>
                                        <option value="">---SELECT HERE---</option>
                                        {[...Array(10).keys()].map(num => (
                                            <option key={num + 1} value={num + 1}>{num + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label">WARD NAME</label>
                                    <input type="text" className="form-control" name='ward_name' value={input.ward_name} onChange={inputHandler} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">PASSWORD</label>
                                    <input type="password" name="password" className="form-control" value={input.password} onChange={inputHandler} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">CONFIRM PASSWORD</label>
                                    <input type="password" name="confirmpass" className="form-control" value={input.confirmpass} onChange={inputHandler} />
                                </div>
                                <div className="col-6">
                                    <div className="d-grid gap-2">
                                        <button onClick={readValue} className="btn btn-success">REGISTER</button>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-grid gap-2">
                                        <a href="/login" className="btn btn-secondary">LOGIN PAGE</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

