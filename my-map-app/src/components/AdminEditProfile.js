import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    Alert
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminEditProfile = () => {
    const [admin, setAdmin] = useState({ username: "", password: "" });
    const [confirmPassword, setConfirmPassword] = useState(""); // ✅ เพิ่ม state สำหรับยืนยัน
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        axios.get("http://localhost:3001/api/admins/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setAdmin({ username: res.data.username, password: "" });
            })
            .catch(() => {
                setError("ไม่สามารถโหลดข้อมูลแอดมินได้");
            });
    }, [token]);

    const handleChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (admin.password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        try {
            await axios.put("http://localhost:3001/api/admins/me", admin, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess("อัปเดตข้อมูลเรียบร้อยแล้ว");
            setError("");
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการบันทึก");
            setSuccess("");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    ✏️ แก้ไขโปรไฟล์แอดมิน
                </Typography>

                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="ชื่อผู้ใช้"
                        name="username"
                        margin="normal"
                        value={admin.username}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="รหัสผ่านใหม่"
                        name="password"
                        type="password"
                        margin="normal"
                        value={admin.password}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="ยืนยันรหัสผ่าน"
                        type="password"
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                        💾 บันทึกการเปลี่ยนแปลง
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        🔙 กลับหน้าแดชบอร์ด
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminEditProfile;
