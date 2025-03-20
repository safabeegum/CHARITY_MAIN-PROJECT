import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

const AdminLogin = () => {
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
      .post("http://localhost:3030/adminlogin", input)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "Incorrect Password") {
          alert("Incorrect Password");
          setInput({
            email: "",
            password: "",
          });
        } else if (response.data.status === "Invalid Username") {
          alert("Incorrect Password or Username");
          setInput({
            email: "",
            password: "",
          });
        } else {
          let token = response.data.token;
          let adminId = response.data.adminId;
          console.log(adminId);
          console.log(token);

          sessionStorage.setItem("adminId", adminId);
          sessionStorage.setItem("token", token);
          navigate("/admindashboard");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-6 col-6 col-xl-6 col-xxl-6">
            <div class="card border-light mb-3">
              <img
                src="https://static.vecteezy.com/system/resources/previews/016/900/444/non_2x/online-dating-app-login-illustration-valentine-s-day-love-match-mobile-leaves-gradient-character-illustration-vector.jpg"
                class="card-img-top"
                alt="..."
              ></img>
              <div class="card-body"></div>
            </div>
          </div>

          <div className="col col-12 col-sm-12 col-md-12 col-lg-6 col-6 col-xl-6 col-xxl-6">
            <div class="card border-light mb-3">
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div className="row g-3">
                  <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xl-12 col-xxl-12">
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <label htmlFor="" className="form-label">
                      EMAIL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      value={input.email}
                      onChange={inputHandler}
                    />
                  </div>

                  <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xl-12 col-xxl-12">
                    <label htmlFor="" className="form-label">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      name="password"
                      id=""
                      className="form-control"
                      value={input.password}
                      onChange={inputHandler}
                    />
                  </div>

                  <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xl-12 col-xxl-12">
                    <div class="d-grid gap-2">
                      <button onClick={readValues} className="btn btn-success">
                        SIGN IN
                      </button>
                    </div>
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

export default AdminLogin;
