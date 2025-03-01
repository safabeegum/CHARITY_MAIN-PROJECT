import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

const SocialWorkersLogin = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const inputHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const readValues = () => {
    console.log(input);

    axios
      .post("http://localhost:3030/socialworkerslogin", input)
      .then((response) => {
        console.log(response.data);

        if (response.data.status === "Incorrect Password") {
          alert("Incorrect Password");
          setInput({ email: "", password: "" });
        } else if (response.data.status === "Invalid Email ID") {
          alert("Incorrect Email or Password");
          setInput({ email: "", password: "" });
        } else if (response.data.status === "Success") {
          let token = response.data.token;
          let userId = response.data.userId;
          console.log(userId);
          console.log(token);

          // Store user details in session storage
          sessionStorage.setItem("userId", userId);
          sessionStorage.setItem("token", token);

          // Redirect to the dashboard
          navigate("/socialworkerdashboard");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("An error occurred while logging in.");
      });
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <div className="row">
          {/* Left Side - Image Card */}
          <div className="col-lg-6">
            <div className="card border-light mb-3">
              <img
                src="https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg"
                className="card-img-top"
                alt="Login Illustration"
              />
              <div className="card-body"></div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-lg-6">
            <div className="card border-light mb-3">
              <div className="card-body">
                <br></br><br></br><br></br>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">EMAIL</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={input.email}
                      onChange={inputHandler}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">PASSWORD</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={input.password}
                      onChange={inputHandler}
                    />
                  </div>

                  <div className="col-12">
                    <div className="d-grid gap-2">
                      <button onClick={readValues} className="btn btn-success">
                        SIGN IN
                      </button>
                    </div>
                  </div>
                </div>

                <br />
                <p className="text-center">
                  Forgot password? Contact the admin for reset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialWorkersLogin;
