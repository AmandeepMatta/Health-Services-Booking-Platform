import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    medical_history: "",
    role: "",  // Add role to the state
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID is null or undefined.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(
        `http://localhost:5000/api/profile/${userId}`,
        config
      );

      // Set profile data, including the role from the Users table
      setProfile({
        username: response.data.username,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
        medical_history: response.data.medical_history || "None",
        role: response.data.role, // Assuming the backend sends the role
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      alert("Error fetching profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.put(
        `http://localhost:5000/api/profile/${userId}`,
        profile,
        config
      );
      alert("Profile updated successfully");
      navigate('/dashboard'); // Redirect to dashboard after updating
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Profile</h2>
      <form>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Medical History:</label>
          <textarea
            name="medical_history"
            value={profile.medical_history}
            onChange={handleChange}
            className="form-control"
            readOnly={profile.role === "patient"} // Readonly if the role is patient
          />
        </div>
        <button type="button" className="btn btn-primary mt-3" onClick={handleUpdate}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
