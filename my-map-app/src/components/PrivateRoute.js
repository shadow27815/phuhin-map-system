import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(null); // null = loading, true = pass, false = fail

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            setIsValid(false);
            return;
        }

        axios
            .get("http://localhost:3001/api/admins/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setIsValid(true);
            })
            .catch(() => {
                // 🔐 Token ไม่ถูกต้อง หรือหมดอายุ
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminLoggedIn");
                localStorage.removeItem("adminName");
                setIsValid(false);
            });
    }, []);

    if (isValid === null) {
        return null; // หรือ Loading Spinner ก็ได้
    }

    return isValid ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
