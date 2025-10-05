import React, { useState } from "react";
import { formatDate, loadCart, updateCartItemQty } from "../../utils/cart";
import { BookingItem } from "../../components/bookingItem";
import axios from "axios";
import { Loader2, CheckCircle, AlertCircle, FileText, X } from "lucide-react";

export const BookingPage = () => {
    const [cart, setCart] = useState(loadCart());
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null); // 'success', 'error', null
    const [quotation, setQuotation] = useState(null);
    const [showQuotation, setShowQuotation] = useState(false);

    const today = formatDate(new Date());
    const tomorrow = formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

    const [startDate, setStartDate] = useState(cart.startingDate || today);
    const [endDate, setEndDate] = useState(cart.endingDate || tomorrow);

    function reloadCart() {
        setCart(loadCart());
    }

    function updateQty(itemKey, newQty) {
        updateCartItemQty(itemKey, newQty);
        reloadCart();
    }

    // Calculate difference in days
    const calculateDays = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end - start;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 0 ? diffDays : 0;
    };

    const totalDays = calculateDays();

    // Get Quotation
    async function getQuotation() {
        if (!cart.orderedItems || cart.orderedItems.length === 0) {
            alert("Your cart is empty! Please add items before getting a quotation.");
            return;
        }

        if (totalDays <= 0) {
            alert("Please select valid dates. End date must be after start date.");
            return;
        }

        setLoading(true);

        const orderData = {
            orderedItems: cart.orderedItems,
            days: totalDays,
            startingDate: startDate,
            endingDate: endDate,
        };

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert("Please login to get a quotation.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:3000/api/orders/quotation",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Quotation:", response.data.quotation);
            setQuotation(response.data.quotation);
            setShowQuotation(true);
            
        } catch (error) {
            console.error("Failed to get quotation:", error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    alert("Your session has expired. Please login again.");
                } else {
                    alert(error.response.data.message || "Failed to generate quotation. Please try again.");
                }
            } else if (error.request) {
                alert("Network error. Please check your connection and try again.");
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    // Create Booking
    async function handleCreateBooking() {
        // Validation
        if (!cart.orderedItems || cart.orderedItems.length === 0) {
            alert("Your cart is empty! Please add items before creating a booking.");
            return;
        }

        if (totalDays <= 0) {
            alert("Please select valid dates. End date must be after start date.");
            return;
        }

        setLoading(true);
        setOrderStatus(null);

        // Prepare order data
        const orderData = {
            orderedItems: cart.orderedItems,
            days: totalDays,
            startingDate: startDate,
            endingDate: endDate,
        };

        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert("Please login to create a booking.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:3000/api/orders",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Order created successfully:", response.data);
            setOrderStatus('success');

            // Clear cart after successful order
            localStorage.setItem('cart', JSON.stringify({
                orderedItems: [],
                days: 1,
                startingDate: formatDate(new Date()),
                endingDate: formatDate(new Date())
            }));
            
            // Close quotation modal if open
            setShowQuotation(false);
            setQuotation(null);
            
            // Reload cart to show empty state
            setTimeout(() => {
                reloadCart();
                // Optional: redirect to orders page
                // window.location.href = '/orders';
            }, 2000);

        } catch (error) {
            console.error("Failed to create order:", error);
            setOrderStatus('error');
            
            if (error.response) {
                if (error.response.status === 401) {
                    alert("Your session has expired. Please login again.");
                } else {
                    alert(error.response.data.message || "Failed to create order. Please try again.");
                }
            } else if (error.request) {
                alert("Network error. Please check your connection and try again.");
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center p-6 bg-gray-50">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                Create Booking
            </h1>

            {/* 🗓️ Date Inputs */}
            <div className="w-full max-w-md bg-white p-5 rounded-2xl shadow-md mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                    Start Date
                </label>
                <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />

                <label className="block text-gray-700 font-medium mb-2">
                    End Date
                </label>
                <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />

                <div className="text-gray-800 text-center mt-2 font-medium">
                    📅 Duration:{" "}
                    <span className="text-blue-600 font-semibold">
                        {totalDays} {totalDays === 1 ? "day" : "days"}
                    </span>
                </div>
            </div>

            {/* 🛒 Cart Items */}
            <div className="w-full max-w-3xl flex flex-col items-center">
                {cart.orderedItems && cart.orderedItems.length > 0 ? (
                    cart.orderedItems.map((item) => (
                        <BookingItem
                            itemKey={item.key}
                            key={item.key}
                            qty={item.qty}
                            refresh={reloadCart}
                            updateQty={updateQty}
                        />
                    ))
                ) : (
                    <div className="w-full text-center p-8 bg-white rounded-2xl shadow-md">
                        <p className="text-gray-500 text-lg">Your cart is empty</p>
                        <p className="text-gray-400 text-sm mt-2">Add some items to create a booking</p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {cart.orderedItems && cart.orderedItems.length > 0 && (
                <div className="w-full max-w-3xl flex flex-col items-center mt-6 space-y-4">
                    <div className="flex space-x-4">
                        {/* Get Quotation Button */}
                        <button
                            onClick={getQuotation}
                            disabled={loading || totalDays <= 0}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <FileText size={20} />
                                    <span>Get Quotation</span>
                                </>
                            )}
                        </button>

                        {/* Create Booking Button */}
                        <button
                            onClick={handleCreateBooking}
                            disabled={loading || totalDays <= 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <span>Create Booking</span>
                            )}
                        </button>
                    </div>

                    {/* Success Message */}
                    {orderStatus === 'success' && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700">
                            <CheckCircle size={20} />
                            <span>Order created successfully! Redirecting...</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {orderStatus === 'error' && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                            <AlertCircle size={20} />
                            <span>Failed to create order. Please try again.</span>
                        </div>
                    )}
                </div>
            )}

            {/* Quotation Modal */}
            {showQuotation && quotation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">Order Quotation</h2>
                            <button
                                onClick={() => setShowQuotation(false)}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* User Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-gray-800">{quotation.email}</p>
                            </div>

                            {/* Date Range */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Rental Period</p>
                                <p className="font-semibold text-gray-800">
                                    {quotation.startingDate} to {quotation.endingDate}
                                </p>
                                <p className="text-sm text-blue-600 mt-1">
                                    Duration: {quotation.days} {quotation.days === 1 ? 'day' : 'days'}
                                </p>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Ordered Items</h3>
                                <div className="space-y-3">
                                    {quotation.orderedItems.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{item.product.name}</p>
                                                    <p className="text-sm text-gray-500">{item.product.category}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Rs. {Number(item.product.price).toLocaleString()} × {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">
                                                    Rs. {Number(item.itemTotal).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500">per day</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between text-gray-700">
                                    <span>Cost per day:</span>
                                    <span className="font-semibold">Rs. {Number(quotation.oneDayCost).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Number of days:</span>
                                    <span className="font-semibold">{quotation.days}</span>
                                </div>
                                <div className="border-t border-blue-200 pt-2 mt-2">
                                    <div className="flex justify-between text-lg font-bold text-blue-700">
                                        <span>Total Amount:</span>
                                        <span>Rs. {Number(quotation.totalAmount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowQuotation(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleCreateBooking}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <span>Confirm & Create Booking</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};