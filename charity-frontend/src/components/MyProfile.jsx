import React, { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import EditProfileModal from "./EditProfileModal";
const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState({
    _id: "",
    name: "",
    username: "",
    address: "",
    email: "",
    phone: "",
    ward_no: "",
    ward_name: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3030/myprofile",
          {},
          { headers: { token } }
        );

        setUser(response.data);
        setInput({
          _id: response.data._id || "",
          name: response.data.name || "",
          username: response.data.username || "",
          address: response.data.address || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          ward_no: response.data.ward_no || "",
          ward_name: response.data.ward_name || "",
        });
      } catch (err) {
        setError(err.response?.data?.status || "Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:3030/editprofilemodal",
        input,
        { headers: { token } }
      );

      if (response.data.status === "Success") {
        alert("Profile updated successfully!");
        setUser({ ...user, ...input });
        setIsEditing(false);
      } else {
        alert(response.data.status || "Update failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <UserNavbar />
      <div style={styles.container}>
        <h2 style={styles.title}>MY PROFILE</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {user ? (
          <div style={styles.profileCard}>
            <div style={styles.imageContainer}>
              <img
                src="https://static.vecteezy.com/system/resources/previews/036/744/532/non_2x/user-profile-icon-symbol-template-free-vector.jpg"
                alt="Profile"
                style={styles.profileImage}
              />
            </div>

            {/* Corrected Mapping */}
            {[
              { label: "ID", key: "_id" },
              { label: "NAME", key: "name" },
              { label: "USERNAME", key: "username" },
              { label: "ADDRESS", key: "address" },
              { label: "EMAIL", key: "email" },
              { label: "PHONE", key: "phone" },
              { label: "WARD NUMBER", key: "ward_no" },
              { label: "WARD NAME", key: "ward_name" },
            ].map((field, index) => (
              <div key={index} style={styles.row}>
                <span style={styles.label}>{field.label}</span>
                <span>{user[field.key] || "N/A"}</span>
              </div>
            ))}

            <button
              style={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              EDIT
            </button>
          </div>
        ) : (
          !error && <p>Loading profile...</p>
        )}
      </div>

      {/* Render the modal only when isEditing is true */}
      {isEditing && (
        <EditProfileModal
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0px auto",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  title: { textAlign: "center", fontSize: "20px", fontWeight: "bold" },
  profileCard: {
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  profileImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
    padding: "10px 0",
  },
  label: { fontWeight: "bold", color: "#555" },
  editButton: {
    display: "block",
    width: "100px",
    margin: "20px auto 0",
    padding: "10px",
    backgroundColor: "purple",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
  },
};

export default MyProfile;
