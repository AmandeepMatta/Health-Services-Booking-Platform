import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get("http://localhost:5000/api/patients", config);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert("Error fetching patients");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Patients List</h2>
      <table className="table table-bordered table-hover mt-4">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No patients found.</td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.username}</td>
                <td>{patient.email}</td>
                <td>
                  <Link to={`/profile/${patient.id}`} className="btn btn-primary">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorDashboard;
