# Component 

```javascript
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        id,
        password,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setId(id);
        navigate("/dashboard");
      } else {
        setError("Invalid ID or Password");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-xl mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter your credentials to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8">
          {error && (
            <div
              className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between shadow-sm transform transition-all hover:scale-[1.02] duration-200 cursor-pointer animate-[pulse_0.4s_ease-in-out_1]"
              onClick={() => setError("")}
            >
              <div className="flex items-center gap-2 flex-1 justify-center pl-6">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-semibold text-red-600 text-center">
                  {error}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setError("");
                }}
                className="text-red-400 hover:text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-colors ml-2"
                aria-label="Dismiss error"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ID Field */}
            <div>
              <label
                htmlFor="id"
                className="block text-sm text-center font-medium text-slate-700 mb-2"
              >
                User ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
                         text-slate-800 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent 
                         transition-all duration-200"
                placeholder="Enter your ID"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-center font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
                           text-slate-800 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent 
                           transition-all duration-200 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                           hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticated}
              className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-medium
                       hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 
                       focus:ring-offset-2 transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center space-x-2 mt-6"
            >
              {isAuthenticated ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        {/* <p className="text-center mt-6 text-xs text-slate-400">
          © 2024 Your Company. All rights reserved.
        </p> */}
      </div>
    </div>
  );
}

export default Login;

```

```javascript
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

```
