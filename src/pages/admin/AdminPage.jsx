import { BiBookBookmark } from "react-icons/bi";
import { CiSpeaker } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import AdminItemPage from "./adminItemPage";
import AddProductPage from "./addItemPage";
import UpdateItemPage from "./updateItemPage";
import { AdminUserPage } from "./adminUsersPage";
import { AdminBookingPage } from "./adminBooking";

export default function AdminPage() {
    const location = useLocation();

    const menu = [
        { path: "/admin", label: "Dashboard", icon: <GoGraph /> },
        { path: "/admin/booking", label: "Booking", icon: <BiBookBookmark /> },
        { path: "/admin/items", label: "Items", icon: <CiSpeaker /> },
        { path: "/admin/users", label: "Users", icon: <FaRegUser /> },
    ];

    return (
        <div className="w-full h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-[280px] h-full bg-white shadow-xl flex flex-col py-6">
                <h1 className="text-2xl font-bold text-center mb-8 text-green-600">Admin Panel</h1>

                <nav className="flex flex-col gap-2 px-4">
                    {menu.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition 
                                ${location.pathname === item.path
                                    ? "bg-green-500 text-white shadow-md"
                                    : "text-gray-700 hover:bg-green-100 hover:text-green-600"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<div className="text-2xl font-semibold">📊 Dashboard Content</div>} />
                    <Route path="/booking" element={<AdminBookingPage/>} />
                    <Route path="/items" element={<AdminItemPage />} />
                    <Route path="/items/add" element={<AddProductPage />} />
                    <Route path="/items/edit" element={<UpdateItemPage />} />
                    <Route path="/users" element={<AdminUserPage/>} />
                </Routes>
            </div>
        </div>
    );
}
