import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SocialWorkersNavbar from "./SocialWorkersNavbar";

const AddPost = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    name: "",
    age: "",
    location: "",
    contact: "",
    purpose: "",
    requiredAmount: "",
    accountName: "",
    accountNo: "",
    ifsc: "",
    bankName: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (event) => {
    const { name, value, files } = event.target;
    if (name === "file") {
      setFile(files[0]);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const readValue = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (
      !input.name ||
      !input.age ||
      !input.location ||
      !input.contact ||
      !file
    ) {
      alert("Please fill all the fields!");
      setLoading(false);
      return;
    }

    if (input.contact.length !== 10 || isNaN(input.contact)) {
      alert("Please enter a valid 10-digit phone number!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    for (let key in input) {
      formData.append(key, input[key]);
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Session Expired! Please login again.");
        navigate("/socialworkerslogin");
        return;
      }

      const response = await axios.post(
        "http://localhost:3030/addpost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(
        "Post Added Successfully! Your post is waiting for admin approval."
      );

      setInput({
        title: "",
        description: "",
        name: "",
        age: "",
        location: "",
        contact: "",
        purpose: "",
        requiredAmount: "",
        accountName: "",
        accountNo: "",
        ifsc: "",
        bankName: "",
      });

      setFile(null);
      setPreview(null);

      navigate("/socialworkersdashboard");
    } catch (error) {
      alert("Failed to Add Post! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SocialWorkersNavbar />
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <br />
            <div className="card border-light mb-3">
              <div className="row g-3">
                <h3 className="text-center fw-bold">ADD NEW POST</h3>

                <div className="col-6">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={input.title}
                    onChange={inputHandler}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={input.description}
                    onChange={inputHandler}
                  ></textarea>
                </div>

                <div className="col-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={input.name}
                    onChange={inputHandler}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">Age</label>
                  <input
                    type="text"
                    className="form-control"
                    name="age"
                    value={input.age}
                    onChange={inputHandler}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={input.location}
                    onChange={inputHandler}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contact"
                    maxLength="10"
                    value={input.contact}
                    onChange={inputHandler}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">Required Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="requiredAmount"
                    value={input.requiredAmount}
                    onChange={inputHandler}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">Purpose</label>
                  <select
                    name="purpose"
                    className="form-control"
                    value={input.purpose}
                    onChange={inputHandler}
                  >
                    <option value="" disabled>
                      ----SELECT PURPOSE----
                    </option>
                    <option value="medical">MEDICAL NEED</option>
                    <option value="education">EDUCATIONAL NEED</option>
                    <option value="disaster">DISASTER RELIEF</option>
                    <option value="palliative">PALLIATIVE NEED</option>
                    <option value="livelihood">LIVELIHOOD NEED</option>
                    <option value="other">OTHERS</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label">Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="file"
                    onChange={inputHandler}
                  />
                </div>

                {preview && (
                  <div className="col-12">
                    <h5>Uploaded File Preview:</h5>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ width: "100%", height: "200px" }}
                    />
                  </div>
                )}

                <h3 class="text-center fw-bold">BANK DETAILS</h3>

                <div className="col-6">
                  <label className="form-label">ACCOUNT HOLDER NAME</label>
                  <input
                    type="text"
                    className="form-control"
                    name="accountName"
                    value={input.accountName}
                    onChange={inputHandler}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">ACCOUNT NUMBER</label>
                  <input
                    type="text"
                    className="form-control"
                    name="accountNo"
                    value={input.accountNo}
                    onChange={inputHandler}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">IFSC CODE</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ifsc"
                    value={input.ifsc}
                    onChange={inputHandler}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">BANK NAME</label>
                  <select
                    name="bankName"
                    className="form-control"
                    value={input.bankName}
                    onChange={inputHandler}
                  >
                    <option value="" disabled>
                      ----SELECT BANK----
                    </option>
                    <option value="sbi">STATE BANK OF INDIA</option>
                    <option value="federal">FEDERAL BANK</option>
                    <option value="axis">AXIS BANK</option>
                    <option value="hdfc">HDFC BANK</option>
                    <option value="pnb">PUNJAB NATIONAL BANK</option>
                    <option value="icici">ICICI BANK</option>
                  </select>
                </div>

                <div className="col-6">
                  <button
                    onClick={readValue}
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Add Post"}
                  </button>
                </div>

                <div className="col-6">
                  <a
                    href="/socialworkersdashboard"
                    className="btn btn-secondary"
                  >
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
