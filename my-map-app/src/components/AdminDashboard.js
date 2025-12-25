import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    CircularProgress,
    Alert,
} from "@mui/material";
import axios from "axios";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        axios
            .get(`${API_BASE_URL}/api/admins/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setAdminName(res.data.username);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("ไม่สามารถโหลดข้อมูลผู้ใช้");
                setLoading(false);
                navigate("/admin/login");
            });
    }, [navigate, API_BASE_URL]);

    const handleLogout = () => {
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    if (loading) {
        return (
            <Container sx={{ mt: 8, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Typography variant="h4" gutterBottom>
                    👋 สวัสดีคุณ {adminName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    ยินดีต้อนรับเข้าสู่แดชบอร์ดผู้ดูแลระบบ
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/admin/manage")}
                    >
                        📍 จัดการจุดพิกัด
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate("/admin/profile")}
                    >
                        ⚙️ แก้ไขข้อมูลแอดมิน
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                    >
                        🚪 ออกจากระบบ
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminDashboard;
