import React from "react";

const EditProfileModal = ({
  handleInputChange,
  handleSubmit,
  setIsEditing,
}) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={{ textAlign: "center" }}>EDIT PROFILE</h2>
        <form onSubmit={handleSubmit}>
          {[
            "Name",
            "Username",
            "Address",
            "Email",
            "Phone",
            "Ward Number",
            "Ward Name",
          ].map((field, index) => {
            const fieldName = field.toLowerCase().replace(" ", "_");
            return (
              <input
                key={index}
                type={fieldName === "email" ? "email" : "text"}
                placeholder={field}
                name={fieldName}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            );
          })}

          <div style={styles.modalButtons}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              CANCEL
            </button>
            <button type="submit" style={styles.submitButton}>
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "600px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "gray",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "white",
  },
  submitButton: {
    backgroundColor: "purple",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "white",
  },
};

export default EditProfileModal;
