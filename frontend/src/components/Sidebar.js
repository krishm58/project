import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FileText, LogOut, User, ChevronLeft } from "lucide-react";
import logo from "../provision.gif";
import logo1 from "../provision.ico";

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const { setIsAuthenticated, id } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate("/login");
    };

    // Note: We're taking Sample and Form out of the standard array
    // to render them dynamically under Dashboard
    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: <FileText size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-[#f3f4f6] font-sans text-gray-800 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-white shadow-lg flex flex-col transition-all duration-300 z-20 ${isSidebarOpen ? "w-64" : "w-20"} fixed h-full relative overflow-hidden`}
            >
                <div
                    className={`flex items-center ${isSidebarOpen ? "justify-between" : "justify-center flex-col"} p-6 h-20 border-b border-gray-100 relative transition-all duration-300`}
                >
                    <div
                        className={`text-gray-500 hover:text-sky-500 transition-colors ${isSidebarOpen ? "" : "mt-2"}`}
                    >
                        {isSidebarOpen ? <img srcSet={logo} className="h-11" alt="" /> : ""}
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`text-gray-500 hover:text-sky-500 transition-colors ${isSidebarOpen ? "" : "mt-2"}`}
                    >
                        {isSidebarOpen ? (
                            <ChevronLeft size={20} />
                        ) : (
                            <img srcSet={logo1} className="h-11" alt="" />
                        )}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
                    {/* Dashboard Accordion Item */}
                    <div className="flex flex-col">
                        <div
                            onClick={() => {
                                setIsDashboardOpen(!isDashboardOpen);
                                // Optionally navigate to /dashboard immediately
                                // navigate('/dashboard');
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${isDashboardOpen ? "text-sky-500 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            <div className="flex items-center gap-4">
                                <span
                                    className={`${isDashboardOpen ? "text-sky-500" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}
                                >
                                    <FileText size={20} />
                                </span>
                                <span
                                    className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                                >
                                    Dashboard
                                </span>
                            </div>
                            {isSidebarOpen && (
                                <ChevronLeft
                                    size={16}
                                    className={`transition-transform duration-300 ${isDashboardOpen ? "-rotate-90 text-sky-500" : "text-gray-400"}`}
                                />
                            )}
                        </div>

                        {/* Dropdown Content */}
                        <div
                            className={`flex flex-col space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isDashboardOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                        >
                            {isSidebarOpen && (
                                <>
                                    <NavLink
                                        to="/sample"
                                        className={({ isActive }) =>
                                            `flex items-center pl-12 pr-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive ? "bg-sky-50 text-sky-600 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`
                                        }
                                    >
                                        Sample
                                    </NavLink>
                                    <NavLink
                                        to="/form"
                                        className={({ isActive }) =>
                                            `flex items-center pl-12 pr-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive ? "bg-sky-50 text-sky-600 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`
                                        }
                                    >
                                        E-Tender Form
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                        <span className="text-xl">
                            <LogOut size={20} />
                        </span>
                        <span
                            className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                        >
                            Logout
                        </span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div
                        className={`flex items-center w-full rounded-xl text-gray-700 ${isSidebarOpen ? "gap-4 px-4 py-3" : "justify-center p-2"}`}
                    >
                        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#fbc2eb] to-[#a6c1ee] text-white shadow-md">
                            <User size={20} />
                        </div>
                        <div
                            className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden ml-4"}`}
                        >
                            <div className="font">{id || "user"}</div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa] p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Sidebar;
