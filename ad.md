CREATE DATABASE IF NOT EXISTS airform;

Use airform;

CREATE TABLE IF NOT EXISTS air(
    id INT AUTO_INCREMENT PRIMARY KEY,
    lineName VARCHAR(200) NOT NULL,
    airFreight FLOAT,
    awbCharges FLOAT,
    hawbCharges FLOAT,
    amsCharges FLOAT,
    gatePass INT(50),
    gmaxCharges FLOAT,
    cartage INT(50),
    clearance FLOAT,
    awcCharges FLOAT,
    labelling FLOAT,
    loading FLOAT,
    terminalStorage FLOAT,
    transportation FLOAT,
    destinationDelivery FLOAT,
    fdaProcessing FLOAT,
    bondCharges FLOAT,
    duties FLOAT,
    mpf FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE DATABASE IF NOT EXISTS etenderform;

USE etenderform;

CREATE TABLE IF NOT EXISTS tenderform (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incoterm VARCHAR(50),
    pickup VARCHAR(200),
    destination VARCHAR(200),
    cargoValue VARCHAR(100),
    pickupSchedule DATETIME,
    cargoGoods TEXT,
    weight FLOAT,
    volume FLOAT,
    dimension VARCHAR(100),
    shippersCount INT,
    palletCount INT,
    portOfLoading VARCHAR(200),
    portOfDischarge VARCHAR(200),
    temperatureRequirement VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE DATABASE IF NOT EXISTS seaShipment;

USE seaShipment;

CREATE TABLE IF NOT EXISTS seaShipmentForm(
    id INT AUTO_INCREMENT PRIMARY KEY,
    lineNAME VARCHAR(200) NOT NULL,
    exportCustomClearance FLOAT,
    shippingLineLocalCharges FLOAT,
    blCharges FLOAT,
    transportationCharges FLOAT,
    vehicleDetention FLOAT,
    plugInCharges FLOAT,
    acd FLOAT,
    oceanFreight FLOAT,
    isfFilingCharges FLOAT,
    doFees FLOAT,
    destinationCustomClearance FLOAT,
    mpf FLOAT,
    hmf FLOAT,
    duty FLOAT,
    quoteValidity DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE DATABASE IF NOT EXISTS userslogin;

USE userslogin;

CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) NOT NULL
);

INSERT INTO user (id, password) VALUES ('6104','6104');

INSERT INTO user (id, password) VALUES ('idve','6104');

INSERT INTO user (id, password) VALUES ('123','123');

INSERT INTO user (id, password) VALUES ('abc','abc');

const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

const fs = require('fs');
const path = require('path');
 
const sql = fs.readFileSync(path.join(__dirname, 'airform.sql'), 'utf8');

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server:', err);
        return;
    }
    console.log('Connected to MySQL server');

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing MySQL:', err);
        } else {
            console.log('Database and table created successfully');
        }
        connection.end();
    });
});

const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync(path.join(__dirname, 'etenderform.sql'), 'utf8');

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server:', err);
        return;
    }
    console.log('Connected to MySQL server');

    connection.query(sql, (err, results) => {
        if(err) {
            console.error('Error executing MySQL:', err);
        } else {
            console.log('Database and table created successfully');
        }
        connection.end();
    });
});

const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync(path.join(__dirname, 'seaShipment.sql'), 'utf8');

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server:', err);
        return;
    }
    console.log('Connected to MySQL server');

    connection.query(sql, (err, results) => {
        if(err) {
            console.error('Error executing MySQL:', err);
        } else {
            console.log('Database and table created successfully');
        }
        connection.end();
    });
});

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=

DB_LOGIN_DATABASE=userslogin
DB_ETENDERFORM=etenderform
DB_AIR_DATABASE=airform
DB_SEA_DATABASE=seaShipment

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_LOGIN_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to Login database:', err);
        return;
    }
    console.log('Connected to Login database');
});

// Tender Form Database Connection
const etenderform = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_ETENDERFORM
});

etenderform.connect((err) => {
    if (err) {
        console.error('Error connecting to E-Tender Form database', err);
    } else {
        console.log('Connected to E-Tender Form database');
    }
});

// Air Form Database Connection
const airform = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_AIR_DATABASE
});

etenderform.connect((err) => {
    if (err) {
        console.error('Error connecting to Air Form database', err);
    } else {
        console.log('Connected to Air Form database');
    }
});

// Sea Shipment Database Connection
const seaShipment = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SEA_DATABASE
});

seaShipment.connect((err) => {
    if (err) {
        console.error('Error connecting to Sea Shipment Form database', err);
    } else {
        console.log('Connected to Sea Shipment Form database');
    }
});

// login
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const sql = "SELECT * FROM user WHERE id = ? AND password = ?";

    db.query(sql, [id, password], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (data.length > 0) {
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.json({ success: false, message: 'Invalid ID or Password' });
        }
    });
});

// E-Tender Form
app.post('/tenders', (req, res) => {
    const {
        incoterm, pickup, destination, cargoValue, pickupSchedule,
        cargoGoods, weight, volume, dimension, shippersCount,
        palletCount, portOfLoading, portOfDischarge, temperatureRequirement
    } = req.body;

    const sql = `INSERT INTO tenderform (
        incoterm, pickup, destination, cargoValue, pickupSchedule,
        cargoGoods, weight, volume, dimension, shippersCount,
        palletCount, portOfLoading, portOfDischarge, temperatureRequirement
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        incoterm, pickup, destination, cargoValue, (pickupSchedule && pickupSchedule.trim() !== '') ? pickupSchedule : null,
        cargoGoods, weight, volume, dimension, shippersCount,
        palletCount, portOfLoading, portOfDischarge, temperatureRequirement
    ];

    etenderform.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error saving e-tender form:', err);
            return res.status(500).json({ success: false, message: 'Failed to save e-tender form' });
        }
        return res.json({ success: true, message: 'E-Tender Form submitted successfully', id: result.insertId });
    });
});

app.get('/tenders', (req, res) => {
    const sql = "SELECT * FROM tenderform ORDER BY created_at DESC";
    etenderform.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching e-tender form:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch e-tender form' });
        }
        return res.json({ success: true, tenders: data });
    });
});

// Air Form
app.post('/air', (req, res) => {
    const {
        lineName, airFreight, awbCharges, hawbCharges, amsCharges,
        gatePass, gmaxCharges, cartage, clearance, awcCharges,
        labelling, loading, terminalStorage, transportation,
        destinationDelivery, fdaProcessing, bondCharges, duties, mpf
    } = req.body;

    const sql = `INSERT INTO air (
        lineName, airFreight, awbCharges, hawbCharges, amsCharges,
        gatePass, gmaxCharges, cartage, clearance, awcCharges,
        labelling, loading, terminalStorage, transportation,
        destinationDelivery, fdaProcessing, bondCharges, duties, mpf
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        lineName, airFreight, awbCharges, hawbCharges, amsCharges,
        gatePass, gmaxCharges, cartage, clearance, awcCharges,
        labelling, loading, terminalStorage, transportation,
        destinationDelivery, fdaProcessing, bondCharges, duties, mpf
    ];

    airform.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error saving air form:', err);
            return res.status(500).json({ success: false, message: 'Failed to save air form' });
        }
        return res.json({ success: true, message: 'Air Form submitted successfully', id: result.insertId });
    });
});

app.get('/air', (req, res) => {
    const sql = "SELECT * FROM air ORDER BY created_at DESC";
    airform.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching air form:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch air form' });
        }
        return res.json({ success: true, air: data });
    });
});

// Sea Shipemnt Form
app.post('/seaShipmentForm', (req, res) => {
    const {
        lineName, exportCustomClearance, shippingLineLocalCharges, blCharges,
        transportationCharges, vehicleDetention, plugInCharges, acd, oceanFreight,
        isfFilingCharges, doFees, destinationCustomClearance, mpf, hmf, duty, quoteValidity
    } = req.body;

    const sql = `INSERT INTO seaShipmentForm (
        lineName, exportCustomClearance, shippingLineLocalCharges, blCharges,
        transportationCharges, vehicleDetention, plugInCharges, acd, oceanFreight,
        isfFilingCharges, doFees, destinationCustomClearance, mpf, hmf, duty, quoteValidity
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        lineName, exportCustomClearance, shippingLineLocalCharges, blCharges,
        transportationCharges, vehicleDetention, plugInCharges, acd, oceanFreight,
        isfFilingCharges, doFees, destinationCustomClearance, mpf, hmf, duty, quoteValidity
    ];

    seaShipment.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error saving sea shipment form:', err);
            return res.status(500).json({ success: false, message: 'Failed to save sea shipment form' });
        }
        return res.json({ success: true, message: 'Sea shipment form submitted successfully', id: result.insertId });
    });
});

app.get('/seaShipmentForm', (req, res) => {
    const sql = "SELECT * FROM seaShipmentForm ORDER BY created_at DESC";
    seaShipment.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching sea shipment form:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch sea shipment form' });
        }
        return res.json({ success: true, seaShipmentForm: data });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [id, setId] = useState('');

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, id, setId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


import React from 'react';

const Dashboard = () => {
    return (
        <div className="flex items-right justify-right h-full relative">
            <p className="text-gray-800">Dashboard User</p>
        </div>
    );
};

export default Dashboard;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setId: setGlobalId } = useAuth();
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
        setGlobalId(id);
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

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;



import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FileText, LogOut, User, ChevronLeft, BrickWall, ChevronDown } from "lucide-react";
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

    const navItems = [
        { path: "/form", label: "E-Tender Form", icon: <FileText size={20} /> }
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
                    <div className="flex flex-col">
                        <div
                            onClick={() => {
                                setIsDashboardOpen(!isDashboardOpen);
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${isDashboardOpen ? "text-gray-500 font hover:text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            <div className="flex items-center gap-4">
                                <span
                                    className={`${isDashboardOpen ? "text-gray-500 group-hover:text-gray-900" : "text-gray-500 group-hover:text-gray-900"} transition-colors`}
                                >
                                    <BrickWall size={20} />
                                </span>
                                <span
                                    className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                                >
                                    Masters
                                </span>
                                
                            </div>
                            {isSidebarOpen && (
                                <ChevronDown
                                    size={20}
                                    className={`transition-transform duration-300 ${isDashboardOpen ? "-rotate-180 text-sky-500" : "text-gray-400"}`}
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
                                        to="/air"
                                        className={({ isActive }) =>
                                            `flex items-center pl-12 pr-4 py-2.5 rounded-lg text-s transition-all duration-200 ${isActive ? "bg-sky-50 text-gray-600 hover:text-gray-900 font-m" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`
                                        }
                                    >
                                        Air Form
                                    </NavLink>
                                    <NavLink
                                        to="/sea"
                                        className={({ isActive }) =>
                                            `flex items-center pl-12 pr-4 py-2.5 rounded-lg text-s transition-all duration-200 ${isActive ? "bg-sky-50 text-gray-600 hover:text-gray-900 font-m" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`
                                        }
                                    >
                                        Sea Form
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-sky-50 text-gray-900 font shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`
                            }
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.label}</span>
                        </NavLink>
                    ))}
                    
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

                <div className="p-2 border-t border-gray-200">
                    <div
                        className={`flex items-center w-full rounded-xl text-gray-500 ${isSidebarOpen ? "gap-4 px-3 py-1" : "justify-center p-2"}`}
                    >
                        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
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

import React, { useState } from 'react';
import axios from 'axios'
// 1. I moved this component OUTSIDE to fix the focus/deselect issue
const InputField = ({ label, name, value, required = false, min = null, placeholder = "0.00", isCurrency = true, optional = false, onChange, onBlur }) => (
  <div className="group w-full">
    <label htmlFor={name} className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
      {label}
      {min && <span className="text-xs normal-case tracking-normal text-gray-400 ml-1">(Min ₹{min})</span>}
      {optional && <span className="text-xs normal-case tracking-normal text-gray-400 ml-1 italic">• Optional</span>}
      {required && <span className="text-black ml-1">*</span>}
    </label>
    <div className="relative">
      {isCurrency && (
        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pl-3">₹</span>
      )}
      {/* Changed type to number to allow free typing easily */}
      <input
        type={isCurrency ? "number" : "text"}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={isCurrency ? placeholder : "Enter " + label.toLowerCase()}
        className={`w-full ${isCurrency ? 'pl-8' : 'pl-3'} pr-3 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:outline-none transition-all duration-200 hover:border-gray-400`}
        // Prevent scroll wheel from changing numbers
        onWheel={(e) => e.target.blur()}
      />
    </div>
  </div>
);

const Air = () => {
  // Updated state with your exact fields from the table
  const [formData, setFormData] = useState({
    lineName: '',
    // Standard Charges
    airFreight: '',
    awbCharges: '',
    hawbCharges: '',
    amsCharges: '',
    gatePass: '385', // Default min
    gmaxCharges: '',
    cartage: '100', // Default min
    clearance: '',
    awcCharges: '',
    labelling: '',
    loading: '',
    terminalStorage: '',
    transportation: '',
    destinationDelivery: '',
    // Other Charges
    fdaProcessing: '',
    bondCharges: '',
    duties: '',
    mpf: ''
  });

  const [showTotal, setShowTotal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Enforce minimum values only when user leaves the field
    if (name === 'gatePass' && value !== '' && parseFloat(value) < 385) {
      alert('Minimum Gate Pass charge is ₹385');
      setFormData(prev => ({ ...prev, [name]: '385' }));
    }
    if (name === 'cartage' && value !== '' && parseFloat(value) < 100) {
      alert('Minimum Cartage charge is ₹100');
      setFormData(prev => ({ ...prev, [name]: '100' }));
    }
  };

  const calculateTotal = (e) => {
    e.preventDefault();
    let total = 0;
    
    Object.keys(formData).forEach(key => {
      // Sum everything except Line Name
      if (key !== 'lineName' && formData[key]) {
        total += parseFloat(formData[key]) || 0;
      }
    });
    
    setTotalAmount(total);
    setShowTotal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateTotal(e);
    console.log('Submitted', formData);

    try {
      const response = await axios.post('http://localhost:5000/air', formData);
      if (response.data.success) {
        alert('Air Form submitted successfully!');
        setFormData({
          lineName: '',
          airFreight: '',
          awbCharges: '',
          hawbCharges: '',
          amsCharges: '',
          gatePass: '385',
          gmaxCharges: '',
          cartage: '100',
          clearance: '',
          awcCharges: '',
          labelling: '',
          loading: '',
          terminalStorage: '',
          transportation: '',
          destinationDelivery: '',
          fdaProcessing: '',
          bondCharges: '',
          duties: '',
          mpf: ''
        });
      }
      else {
        alert('Failed to submit air form.');
      }
    }
    catch (error) {
      console.error('Error submitting air form:', error);
      alert('An error occurred while submitting the air form.');
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      setFormData({
        lineName: '',
        airFreight: '',
        awbCharges: '',
        hawbCharges: '',
        amsCharges: '',
        gatePass: '385',
        gmaxCharges: '',
        cartage: '100',
        clearance: '',
        awcCharges: '',
        labelling: '',
        loading: '',
        terminalStorage: '',
        transportation: '',
        destinationDelivery: '',
        fdaProcessing: '',
        bondCharges: '',
        duties: '',
        mpf: ''
      });
      setShowTotal(false);
      setTotalAmount(0);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-black text-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-light tracking-wide">FREIGHT CHARGES</h1>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">International Air Cargo</p>
            </div>
            {/* <div className="sm:text-right">
              <p className="text-xs uppercase tracking-wider text-gray-400">Form</p>
              <p className="text-xl sm:text-2xl font-light">001</p>
            </div> */}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-12 w-full">
          
          {/* General Information */}
          <section className="w-full">
            <div className="border-b border-black pb-2 mb-6 lg:mb-8">
              <h2 className="text-sm font-medium uppercase tracking-widest">General Information</h2>
            </div>
            <div className="w-full max-w-full lg:max-w-md">
              <InputField
                label="Line Name"
                name="lineName"
                value={formData.lineName}
                required={true}
                isCurrency={false}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </section>

          {/* Standard Charges */}
          <section className="w-full">
            <div className="border-b border-black pb-2 mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-sm font-medium uppercase tracking-widest">Standard Charges</h2>
                <span className="text-xs uppercase tracking-wider text-gray-500">All amounts in INR</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 w-full">
              <InputField 
              label="Air Freight (Airline Wise)" 
              name="airFreight" 
              value={formData.airFreight} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="Airway Bill Charges" 
              name="awbCharges" 
              value={formData.awbCharges} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="House Airway Bill Charges" 
              name="hawbCharges" 
              value={formData.hawbCharges} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="AMS (Automated Manifest System)" 
              name="amsCharges" 
              value={formData.amsCharges} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />
              
              <InputField 
              label="Gate Pass" 
              name="gatePass" 
              value={formData.gatePass} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required min={385} 
              />
              
              <InputField 
              label="GMAX Charges (Per MAWB & HAWB)" 
              name="gmaxCharges" 
              value={formData.gmaxCharges} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />
              
              <InputField 
              label="Cartage" 
              name="cartage" 
              value={formData.cartage} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required min={100} 
              />
              
              <InputField 
              label="Clearance" 
              name="clearance" 
              value={formData.clearance} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="Allstates WorldCargo (AWC)" 
              name="awcCharges" 
              value={formData.awcCharges} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="Labelling & Measurement" 
              name="labelling" 
              value={formData.labelling} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="Loading/Un-loading" 
              name="loading" 
              value={formData.loading} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="Terminal Storage, facilitation & Processing" 
              name="terminalStorage" 
              value={formData.terminalStorage} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="Transportation" 
              name="transportation" 
              value={formData.transportation} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

              <InputField 
              label="Destination Delivery Charges" 
              name="destinationDelivery" 
              value={formData.destinationDelivery} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              required 
              />

            </div>
          </section>

          {/* Other Charges */}
          <section className="w-full">
            <div className="border-b border-black pb-2 mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-sm font-medium uppercase tracking-widest">Other Charges</h2>
                <span className="text-xs uppercase tracking-wider text-gray-500">If Applicable</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
              <InputField label="FDA Processing if applicable" 
              name="fdaProcessing" 
              value={formData.fdaProcessing} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              optional 
              />

              <InputField label="Bond Charges if Applicable" 
              name="bondCharges" 
              value={formData.bondCharges} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              optional 
              />

              <InputField label="Duties if applicable" 
              name="duties" 
              value={formData.duties} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              optional 
              />

              <InputField label="MPF (Merchandise Processing Fee)" 
              name="mpf" 
              value={formData.mpf} 
              onChange={handleInputChange} 
              onBlur={handleBlur} 
              optional 
              />

            </div>
          </section>

          {/* Total Display */}
          {showTotal && (
            <section className="border-t border-b border-gray-200 py-6 lg:py-8 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Amount</p>
                  <p className="text-2xl sm:text-3xl font-light">{formatCurrency(totalAmount)}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Calculated on</p>
                  <p className="text-sm">{new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <section className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 lg:pt-8 border-t border-gray-200 w-full">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-6 lg:px-8 py-3 bg-white border border-black text-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-all duration-200"
            >
              Reset
            </button>
            {/* <button
              type="button"
              onClick={calculateTotal}
              className="w-full sm:w-auto px-6 lg:px-8 py-3 bg-gray-800 text-white text-sm uppercase tracking-wider hover:bg-gray-700 transition-all duration-200"
            >
              Calculate
            </button> */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 lg:px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-900 transition-all duration-200"
            >
              Submit
            </button>
          </section>
        </form>

        {/* Footer */}
        {/* <div className="mt-12 lg:mt-16 pt-8 border-t border-gray-200 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-xs uppercase tracking-wider text-gray-400">
            <div>
              <p className="font-medium text-black mb-2">Required Fields</p>
              <p>Marked with asterisk (*)</p>
            </div>
            <div>
              <p className="font-medium text-black mb-2">Currency</p>
              <p>Indian Rupees (INR)</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Air;

import React, { useState } from 'react';
import axios from 'axios';
import {
    Package,
    MapPin,
    Calendar,
    Thermometer,
    Anchor,
    IndianRupee,
    Truck,
    AlertCircle,
    FileText,
    Box,
    Weight,
    Maximize
} from 'lucide-react';


const InputField = ({ icon: Icon, label, ...props }) => (
    <div className="relative">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {label}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-gray-400" />
                </div>
            )}
            <input
                className={`
          w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 
          bg-white border border-gray-200 rounded-md
          text-sm text-gray-900 placeholder-gray-400
          focus:border-gray-300 focus:ring-1 focus:ring-gray-200
          transition-all duration-200
        `}
                {...props}
            />
        </div>
    </div>
);

const SelectField = ({ icon: Icon, label, children, ...props }) => (
    <div className="relative">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {label}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-gray-400" />
                </div>
            )}
            <select
                className={`
          w-full ${Icon ? 'pl-9' : 'pl-3'} pr-8 py-2 
          bg-white border border-gray-200 rounded-md
          text-sm text-gray-900 appearance-none
          focus:border-gray-300 focus:ring-1 focus:ring-gray-200
          transition-all duration-200
        `}
                {...props}
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const ETenderForm = () => {
    const [formData, setFormData] = useState({
        incoterm: '',
        pickup: '',
        destination: '',
        cargoValue: '',
        pickupSchedule: '',
        cargoGoods: '',
        temperatureRequirement: '15°C - 25°C',
        weight: '',
        volume: '',
        dimension: '',
        shippersCount: '',
        palletCount: '',
        portOfLoading: '',
        portOfDischarge: '',
        acceptCondition: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        try {
            const response = await axios.post('http://localhost:5000/tenders', formData);
            if (response.data.success) {
                alert('E-Tender Form submitted successfully!');
                
                setFormData({
                    incoterm: '',
                    pickup: '',
                    destination: '',
                    cargoValue: '',
                    pickupSchedule: '',
                    cargoGoods: '',
                    temperatureRequirement: '15°C - 25°C',
                    weight: '',
                    volume: '',
                    dimension: '',
                    shippersCount: '',
                    palletCount: '',
                    portOfLoading: '',
                    portOfDischarge: '',
                    acceptCondition: false
                });
            } else {
                alert('Failed to submit tender.');
            }
        } catch (error) {
            console.error('Error submitting tender:', error);
            alert('An error occurred while submitting the tender.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-medium text-gray-900 mb-1">E-Tender Submission</h1>
                    <p className="text-sm text-gray-500">Complete all fields to submit your shipping tender</p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <form onSubmit={handleSubmit} className="p-6 lg:p-8">
                        {/* Section 1: Basic Information */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center mr-2.5">
                                    <FileText className="h-4 w-4 text-gray-600" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Basic Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField
                                    icon={Package}
                                    label="Incoterm"
                                    name="incoterm"
                                    value={formData.incoterm}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Incoterm</option>
                                    <option value="EXW">EXW - Ex Works</option>
                                    <option value="FCA">FCA - Free Carrier</option>
                                    <option value="CPT">CPT - Carriage Paid To</option>
                                    <option value="CIP">CIP - Carriage and Insurance Paid To</option>
                                    <option value="DAP">DAP - Delivered at Place</option>
                                    <option value="DPU">DPU - Delivered at Place Unloaded</option>
                                    <option value="DDP">DDP - Delivered Duty Paid</option>
                                    <option value="FOB">FOB - Free on Board</option>
                                    <option value="CFR">CFR - Cost and Freight</option>
                                    <option value="CIF">CIF - Cost, Insurance and Freight</option>
                                </SelectField>

                                <InputField
                                    icon={IndianRupee}
                                    label="Cargo Value"
                                    type="text"
                                    name="cargoValue"
                                    value={formData.cargoValue}
                                    onChange={handleChange}
                                    placeholder="Enter cargo value"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-6"></div>

                        {/* Section 2: Locations */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center mr-2.5">
                                    <MapPin className="h-4 w-4 text-gray-600" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Locations & Schedule</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <InputField
                                    icon={MapPin}
                                    label="Pickup Location"
                                    type="text"
                                    name="pickup"
                                    value={formData.pickup}
                                    onChange={handleChange}
                                    placeholder="Enter pickup address"
                                />

                                <InputField
                                    icon={MapPin}
                                    label="Destination"
                                    type="text"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    placeholder="Enter destination address"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    icon={Calendar}
                                    label="Pickup Schedule"
                                    type="datetime-local"
                                    name="pickupSchedule"
                                    value={formData.pickupSchedule}
                                    onChange={handleChange}
                                />

                                <InputField
                                    icon={Truck}
                                    label="Cargo Description"
                                    type="text"
                                    name="cargoGoods"
                                    value={formData.cargoGoods}
                                    onChange={handleChange}
                                    placeholder="Describe the cargo"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-6"></div>

                        {/* Section 3: Cargo Details */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center mr-2.5">
                                    <Box className="h-4 w-4 text-gray-600" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Cargo Specifications</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <InputField
                                    icon={Weight}
                                    label="Weight (kg)"
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="0"
                                />

                                <InputField
                                    icon={Box}
                                    label="Volume (m³)"
                                    type="number"
                                    name="volume"
                                    value={formData.volume}
                                    onChange={handleChange}
                                    placeholder="0"
                                />

                                <InputField
                                    icon={Maximize}
                                    label="Dimensions"
                                    type="text"
                                    name="dimension"
                                    value={formData.dimension}
                                    onChange={handleChange}
                                    placeholder="L×W×H cm"
                                />

                                <InputField
                                    icon={Thermometer}
                                    label="Temperature"
                                    type="text"
                                    name="temperatureRequirement"
                                    value={formData.temperatureRequirement}
                                    onChange={handleChange}
                                    placeholder="15°C - 25°C"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <InputField
                                    label="Number of Shippers"
                                    type="number"
                                    name="shippersCount"
                                    value={formData.shippersCount}
                                    onChange={handleChange}
                                    placeholder="0"
                                />

                                <InputField
                                    label="Number of Pallets"
                                    type="number"
                                    name="palletCount"
                                    value={formData.palletCount}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-6"></div>

                        {/* Section 4: Ports */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center mr-2.5">
                                    <Anchor className="h-4 w-4 text-gray-600" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Port Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    icon={Anchor}
                                    label="Port of Loading"
                                    type="text"
                                    name="portOfLoading"
                                    value={formData.portOfLoading}
                                    onChange={handleChange}
                                    placeholder="Enter port name"
                                />

                                <InputField
                                    icon={Anchor}
                                    label="Port of Discharge"
                                    type="text"
                                    name="portOfDischarge"
                                    value={formData.portOfDischarge}
                                    onChange={handleChange}
                                    placeholder="Enter port name"
                                />
                            </div>
                        </div>

                        {/* Temperature Condition */}
                        <div className="mb-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="ml-3 flex-1">
                                        <h3 className="text-sm font-medium text-amber-900 mb-1">Temperature Control Requirement</h3>
                                        <p className="text-xs text-amber-700 mb-3">
                                            The consignment must be maintained under temperature controlled conditions between
                                            15°C to 25°C, from pickup through to delivery.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                            {/* <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-sm text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Save Draft
              </button> */}
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-800 text-white text-sm rounded-md font-medium hover:bg-gray-700 transition-all duration-200"
                            >
                                Submit Tender
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ETenderForm;


import React, { useState } from 'react';
import axios from 'axios';

function FieldRow({ label, sublabel, name, value, onChange, placeholder = "0.00", suffix, isDate = false, isText = false }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-8 py-4 px-5 md:px-8 border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
            <div className="flex flex-col justify-center">
                <p className="text-gray-900 text-[13px] font-semibold">{label}</p>
                {sublabel && <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">{sublabel}</p>}
            </div>
            <div className="flex items-center">
                {isDate ? (
                    <input
                        type="date"
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-800 transition-all duration-200 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5"
                    />
                ) : isText ? (
                    <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder="Enter shipping line"
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300 transition-all duration-200 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5"
                    />
                ) : (
                    <div className="relative flex items-center w-full">
                        <span className="absolute left-3.5 text-gray-400 text-[12px] font-medium">₹</span>
                        <input
                            type="number"
                            name={name}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300 transition-all duration-200 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {suffix && (
                            <span className="absolute right-3.5 text-gray-300 text-[11px] font-medium">{suffix}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function SectionLabel({ label }) {
    return (
        <div className="px-5 md:px-8 py-2.5 bg-gray-50 border-b border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</span>
        </div>
    );
}

function Toast({ message, show }) {
    if (!show) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[toastIn_0.4s_ease-out_forwards]">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2.5">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
}

function Sea() {
    const [showToast, setShowToast] = useState(false);
    const [formData, setFormData] = useState({
        lineName: '',
        exportCustomClearance: '',
        shippingLineLocalCharges: '',
        blCharges: '',
        transportationCharges: '',
        vehicleDetention: '',
        plugInCharges: '',
        acd: '',
        oceanFreight: '',
        isfFilingCharges: '',
        doFees: '',
        destinationCustomClearance: '',
        mpf: '',
        hmf: '',
        duty: '',
        quoteValidity: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            const response = await axios.post('http://localhost:5000/seaShipmentForm', formData);
            if (response.data.success) {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                setFormData({
                    lineName: '',
                    exportCustomClearance: '',
                    shippingLineLocalCharges: '',
                    blCharges: '',
                    transportationCharges: '',
                    vehicleDetention: '',
                    plugInCharges: '',
                    acd: '',
                    oceanFreight: '',
                    isfFilingCharges: '',
                    doFees: '',
                    destinationCustomClearance: '',
                    mpf: '',
                    hmf: '',
                    duty: '',
                    quoteValidity: ''
                });
            } 
            else {
                alert('Failed to submit sea shipment form');
            }
        } 
        catch (error) {
            console.error('Error submitting sea shipment form:', error);
            alert('An error occurred while submitting the sea shipment form:');
        }
    };

    const handleReset = () => {
        setFormData({
            lineName: '', exportCustomClearance: '', shippingLineLocalCharges: '',
            blCharges: '', transportationCharges: '', vehicleDetention: '',
            plugInCharges: '', acd: '', oceanFreight: '', isfFilingCharges: '',
            doFees: '', destinationCustomClearance: '', mpf: '', hmf: '',
            duty: '', quoteValidity: ''
        });
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 18h18M5 18V9l7-5 7 5v9" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">Sea Shipment</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Export Form</p>
                        </div>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium hidden sm:block">Nhava Sheva → Bells, TN 38006</span>
                </div>
            </div>

            {/* Header */}
            <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Quotation Details</h1>
                <p className="text-gray-400 text-sm mt-1">Nhava Sheva → Bells, TN 38006 (via New York)</p>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-5 md:px-8 pb-16">
                <form onSubmit={handleSubmit}>
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                        <FieldRow
                            label="Line Name"
                            name="lineName"
                            value={formData.lineName}
                            onChange={handleChange}
                            isText={true}
                        />

                        <SectionLabel label="Origin Charges" />

                        <FieldRow
                            label="Export Custom Clearance Charges"
                            name="exportCustomClearance"
                            value={formData.exportCustomClearance}
                            onChange={handleChange}
                        />
                        <FieldRow
                            label="Shipping Line Local Charges"
                            sublabel="THC, Toll, MUC, Seal & Equipment Surcharge — At Actual"
                            name="shippingLineLocalCharges"
                            value={formData.shippingLineLocalCharges}
                            onChange={handleChange}
                        />
                        <FieldRow
                            label="B/L Charges"
                            name="blCharges"
                            value={formData.blCharges}
                            onChange={handleChange}
                        />
                        <FieldRow
                            label="Transportation Charges"
                            name="transportationCharges"
                            value={formData.transportationCharges}
                            onChange={handleChange}
                        />
                        <FieldRow
                            label="Vehicle Detention with Genset (Roaming)"
                            sublabel="Per Day — If Applicable"
                            name="vehicleDetention"
                            value={formData.vehicleDetention}
                            onChange={handleChange}
                            suffix="/day"
                        />
                        <FieldRow
                            label="Plug-in Charges at CFS"
                            sublabel="At Actual — If Applicable"
                            name="plugInCharges"
                            value={formData.plugInCharges}
                            onChange={handleChange}
                        />
                        <FieldRow
                            label="ACD"
                            sublabel="Advance Cargo Declaration"
                            name="acd"
                            value={formData.acd}
                            onChange={handleChange}
                        />

                        <SectionLabel label="Ocean Freight" />

                        <FieldRow
                            label="Ocean Freight"
                            sublabel="Nhava Sheva → Bells, TN 38006 (via New York)"
                            name="oceanFreight"
                            value={formData.oceanFreight}
                            onChange={handleChange}
                        />

                        <SectionLabel label="Destination" />

                        <FieldRow
                            label="ISF Filing Charges"
                            sublabel="Importer Security Filing"
                            name="isfFilingCharges"
                            value={formData.isfFilingCharges}
                            onChange={handleChange}
                        />
                        <FieldRow
                            label="D.O. Fees"
                            sublabel="Delivery Order"
                            name="doFees"
                            value={formData.doFees}
                            onChange={handleChange}
                        />
                        <FieldRow
                            label="Destination Custom Clearance"
                            name="destinationCustomClearance"
                            value={formData.destinationCustomClearance}
                            onChange={handleChange}
                        />

                        <SectionLabel label="Duties & Fees" />

                        <FieldRow
                            label="MPF"
                            sublabel="0.3464% of commercial invoice value (Min. $31.67 — Max. $614.35)"
                            name="mpf"
                            value={formData.mpf}
                            onChange={handleChange}
                        />
                        <FieldRow
                            label="HMF"
                            sublabel="Harbor Maintenance Fee — 0.125% of commercial invoice value"
                            name="hmf"
                            value={formData.hmf}
                            onChange={handleChange}
                        />

                        {/* Duty with warning note */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-8 py-4 px-5 md:px-8 border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                            <div className="flex flex-col justify-center">
                                <p className="text-gray-900 text-[13px] font-semibold">Duty</p>
                                <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-sm">
                                    <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <p className="text-[11px] text-amber-700 leading-relaxed">
                                        Medicaments under <span className="font-mono font-bold">3004.90</span> are generally FREE but need exact description to confirm.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="relative flex items-center w-full">
                                    <span className="absolute left-3.5 text-gray-400 text-[12px] font-medium">₹</span>
                                    <input
                                        type="number"
                                        name="duty"
                                        value={formData.duty}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300 transition-all duration-200 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <SectionLabel label="Validity" />

                        <FieldRow
                            label="Quote Validity"
                            name="quoteValidity"
                            value={formData.quoteValidity}
                            onChange={handleChange}
                            isDate={true}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-end mt-6 gap-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-gray-400 border border-gray-200 bg-white rounded-xl hover:text-gray-600 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-10 py-2.5 text-[13px] font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-sm"
                        >
                            Submit Quote
                        </button>
                    </div>
                </form>
            </div>

            <Toast message="Quote submitted successfully" show={showToast} />
        </div>
    );
}

export default Sea;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';
import Air from './forms/Air';
import Form from './forms/Form';
import Sea from './forms/Sea';
import Sidebar from './components/Sidebar';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="font-sans text-gray-800">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route element={<PrivateRoute><Sidebar /></PrivateRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/air" element={<Air />} />
                            <Route path="/form" element={<Form />} />
                            <Route path="/sea" element={<Sea />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;


.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

