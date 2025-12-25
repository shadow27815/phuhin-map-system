// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import NUATMPage from './components/NUATM';
import HeaderBar from './components/HeaderBar';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminManagePoints from './components/AdminManagePoints';
import PointCreatePage from './components/PointCreatePage';
import PrivateRoute from './components/PrivateRoute';
import PointEditPage from './components/PointEditPage';
import AdminEditProfile from './components/AdminEditProfile';

const AppLayout = () => {
  const location = useLocation();

  return (
    <>
      <HeaderBar />
      <main
        className={`main-content ${location.pathname === '/map' ? 'no-scroll-page' : ''}`}
        style={{ paddingTop: location.pathname === '/map' ? 0 : '68px' }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<NUATMPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <PrivateRoute>
                <AdminManagePoints />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <PrivateRoute>
                <AdminEditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/points/create"
            element={
              <PrivateRoute>
                <PointCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/points/edit/:id"
            element={
              <PrivateRoute>
                <PointEditPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
