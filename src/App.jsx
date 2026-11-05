import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import Details from './pages/Details';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/login.html" element={<Navigate to="/login" replace />} />

      <Route path="/register" element={<Register />} />
      <Route path="/register.html" element={<Navigate to="/register" replace />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard.html" element={<Navigate to="/dashboard" replace />} />

      <Route path="/create" element={<Create />} />
      <Route path="/create.html" element={<Navigate to="/create" replace />} />

      <Route path="/details" element={<Details />} />
      <Route path="/details.html" element={<Navigate to="/details" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

