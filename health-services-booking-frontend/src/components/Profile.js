import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    medicalHistory: "None",
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Fetch user ID from localStorage
  
      // Check if the user ID is null or undefined before making the API call
      if (!userId) {
        console.error("User ID is null or undefined.");
        return; // Exit the function early if userId is invalid
      }
  
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      const response = await axios.get(`http://localhost:5000/api/profile/${userId}`, config);
  
      setProfile({
        name: response.data.username,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
        medicalHistory: response.data.medical_history || "None",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      alert("Error fetching profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center bg-primary text-white">
              <h2>Profile Information</h2>
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label><strong>Name:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.name}
                  readOnly
                />
              </div>
              <div className="form-group mb-3">
                <label><strong>Email:</strong></label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email}
                  readOnly
                />
              </div>
              <div className="form-group mb-3">
                <label><strong>Phone:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.phone}
                  readOnly
                />
              </div>
              <div className="form-group mb-3">
                <label><strong>Address:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.address}
                  readOnly
                />
              </div>
            </div>
            <div className="card-footer">
              <h4>Medical Records</h4>
              <div className="alert alert-info">
                <strong>Medical History:</strong> {profile.medicalHistory}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
