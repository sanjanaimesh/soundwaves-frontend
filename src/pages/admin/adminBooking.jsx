import React, { useEffect, useState } from "react";
import axios from "axios";

export const AdminBookingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders (admin or user-specific)
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3000/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        📦 Booking Management
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer Email</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Days</th>
                <th className="py-3 px-4 text-left">Start Date</th>
                <th className="py-3 px-4 text-left">End Date</th>
                <th className="py-3 px-4 text-left">Total Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-700">
                    {order.orderId}
                  </td>

                  <td className="py-3 px-4 text-gray-600">{order.email}</td>

                  <td className="py-3 px-4 text-gray-600">
                    <ul className="list-disc ml-5">
                      {order.orderedItems.map((item, index) => (
                        <li key={index}>
                          {item.product.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="py-3 px-4 text-gray-600">{order.days}</td>

                  <td className="py-3 px-4 text-gray-600">
                    {new Date(order.startingDate).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    {new Date(order.endingDate).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 font-medium text-green-700">
                    RS {order.totalAmount?.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                      onClick={() => alert(`Delete order: ${order.orderId}`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
