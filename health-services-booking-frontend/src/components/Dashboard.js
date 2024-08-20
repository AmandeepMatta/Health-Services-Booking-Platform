import React from 'react';

function Dashboard() {
  // You can fetch and display user-specific data here
  return (
    <div className="container mt-5">
      <h1 className="text-center">Welcome to Your Dashboard</h1>
      <p className="text-center">This is your dashboard. From here, you can manage your appointments, view your profile, and more.</p>
      
      {/* You can add more dashboard components here */}
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Manage Appointments</h5>
              <p className="card-text">View and manage your upcoming appointments.</p>
              <button className="btn btn-primary">Go to Appointments</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">View Profile</h5>
              <p className="card-text">Update your personal information and settings.</p>
              <button className="btn btn-primary">Go to Profile</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Settings</h5>
              <p className="card-text">Manage your account settings and preferences.</p>
              <button className="btn btn-primary">Go to Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
