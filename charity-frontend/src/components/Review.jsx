import axios from "axios";
import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";

const Review = () => {
  const [input, setInput] = useState({
    review: "",
    rating: 0,
  });

  useEffect(() => {
    console.log("Stored Token:", sessionStorage.getItem("token"));
  }, []);

  const inputHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const setRating = (ratingValue) => {
    setInput({ ...input, rating: ratingValue });
  };

  const readValues = async (event) => {
    event.preventDefault();

    if (input.review.trim() === "") {
      alert("Please provide your review before submitting.");
      return;
    }
    if (input.rating === 0) {
      alert("Please give a rating before submitting.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You need to log in first.");
      return;
    }

    console.log("Submitting Review:", input);
    console.log("Token before sending:", token);

    try {
      const response = await axios.post(
        "http://localhost:3030/review",
        { review: input.review, rating: input.rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.data.status === "Success") {
        alert("Review and Rating Submitted Successfully!");
        setInput({ review: "", rating: 0 });
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. Please try again.");
    }
  };

  const styles = {
    starContainer: { textAlign: "center", marginTop: "10px" },
    star: {
      fontSize: "35px",
      cursor: "pointer",
      marginRight: "8px",
      color: "gray",
      transition: "color 0.3s",
    },
    starSelected: { color: "gold" },
  };

  return (
    <div>
      <UserNavbar />
      <div className="container">
        <div className="row g-3">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="card mb-3">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src="https://cdn.botpenguin.com/assets/website/User_Feedback_d4677ac183.png"
                    className="img-fluid rounded-start"
                    alt="Feedback"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <textarea
                      name="review"
                      placeholder="Enter your Review!!!"
                      value={input.review}
                      rows="5"
                      className="form-control"
                      onChange={inputHandler}
                    ></textarea>

                    {}
                    <div style={styles.starContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={
                            star <= input.rating
                              ? { ...styles.star, ...styles.starSelected }
                              : styles.star
                          }
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <br />
                    <button onClick={readValues} className="btn btn-primary">
                      Submit your Review
                    </button>
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

export default Review;
