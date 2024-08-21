import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    medical_history: '',
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(`http://localhost:5000/api/profile/${id}`, config);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      alert('Error fetching profile data');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(`http://localhost:5000/api/profile/${id}`, profile, config);
      alert('Profile updated successfully');
      navigate('/doctor/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
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

  return (
    <div className="container mt-5">
      <h2 className="text-center">Patient Profile</h2>
      <form>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="form-control"
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
          />
        </div>
        <div className="form-group">
          <label>Medical History:</label>
          <textarea
            name="medical_history"
            value={profile.medical_history}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="button" className="btn btn-primary mt-3" onClick={handleUpdate}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default PatientProfile;
