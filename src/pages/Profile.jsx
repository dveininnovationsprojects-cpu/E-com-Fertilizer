import React, { useEffect, useState } from "react";
import "./App.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔗 Fetch user from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer TOKEN" (later add JWT)
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🔗 Update API
  const handleSave = () => {
    fetch("http://localhost:5000/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Profile Updated ✅");
        setEdit(false);
      })
      .catch((err) => console.log(err));
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="profile-page">

      {/* LEFT SIDE */}
      <div className="profile-left">
        <div className="profile-card">
          <div className="avatar">
            {user.name?.charAt(0)}
          </div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        <div className="menu">
          <p>📦 My Orders</p>
          <p>❤️ Wishlist</p>
          <p>⚙️ Settings</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="profile-right">
        <h2>Personal Information</h2>

        <div className="form-grid">
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!edit}
          />

          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!edit}
          />

          <input value={user.userid} disabled />
        </div>

        {edit ? (
          <button className="btn" onClick={handleSave}>
            Save Changes
          </button>
        ) : (
          <button className="btn" onClick={() => setEdit(true)}>
            Edit Profile
          </button>
        )}

        {/* Orders */}
        <div className="orders">
          <h3>Recent Orders</h3>

          {user.orders?.map((order) => (
            <div key={order._id} className="order-card">
              <p>Order ID: {order._id}</p>
              <p>Status: {order.status}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Profile;