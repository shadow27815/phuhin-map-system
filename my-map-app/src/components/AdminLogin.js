import React, { useState } from "react";
import {
    Box, Button, Container, TextField, Typography, Paper, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // clear error ก่อน

        try {
            const res = await axios.post("http://localhost:3001/api/admins/login", {
                username,
                password
            });

            if (res.data.success && res.data.token) {
                // ✅ เก็บ token และชื่อแอดมิน
                localStorage.setItem("adminLoggedIn", "true");
                localStorage.setItem("adminName", res.data.admin.username);
                localStorage.setItem("adminToken", res.data.token);

                navigate("/admin/dashboard");
            } else {
                setError("เข้าสู่ระบบไม่สำเร็จ");
            }
        } catch (err) {
            setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    เข้าสู่ระบบเจ้าหน้าที่
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleLogin}>
                    <TextField
                        label="ชื่อผู้ใช้"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="รหัสผ่าน"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        เข้าสู่ระบบ
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminLogin;
