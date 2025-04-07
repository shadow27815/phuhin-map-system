import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PrivateRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            setIsValid(false);
            return;
        }

        axios.get(`${API_BASE_URL}/api/admins/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => setIsValid(true))
            .catch(() => {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminLoggedIn");
                localStorage.removeItem("adminName");
                setIsValid(false);
            });
    }, []);

    if (isValid === null) return null;
    return isValid ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
