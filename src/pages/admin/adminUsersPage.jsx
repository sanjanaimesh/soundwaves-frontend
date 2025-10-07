import axios from "axios";
import React, { useEffect, useState } from "react";

export const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Load all users
  const loadUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Toggle block/unblock
  const handleBlockToggle = async (email) => {
    try {
      await axios.put(
        `http://localhost:3000/api/users/block/${email}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI after blocking/unblocking
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email
            ? { ...user, isBlocked: !user.isBlocked }
            : user
        )
      );
    } catch (err) {
      console.error("Error toggling block status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        👥 User Management
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Profile</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <img
                    src={
                      user.profilePicture?.includes("http")
                        ? user.profilePicture
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS06TGTOlnRnEavBmnT7MIC1fre5hAhE3HfTQ&s"
                    }
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td className="py-3 px-4 font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{user.phone}</td>
                <td className="py-3 px-4 text-gray-600">{user.address}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleBlockToggle(user.email)}
                    className={`${
                      user.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white px-3 py-1 rounded-lg text-sm transition-colors`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
