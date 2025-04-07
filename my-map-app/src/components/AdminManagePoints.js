import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Box,
    Paper,
    CircularProgress,
    Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminManagePoints = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchPoints = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const res = await axios.get("http://localhost:3001/api/points", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const sorted = res.data.sort((a, b) => a.id - b.id);
            setPoints(sorted);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminLoggedIn");
                navigate("/admin/login");
            } else {
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin/points/edit/${id}`);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบจุดนี้?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem("adminToken");
            await axios.delete(`http://localhost:3001/api/points/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPoints(points.filter((p) => p.id !== id));
        } catch (error) {
            alert("เกิดข้อผิดพลาดขณะลบข้อมูล");
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 6, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    📌 รายการจุดพิกัดทั้งหมด
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/admin/dashboard")}
                        sx={{ mb: 1 }}
                    >
                        ⬅️ ย้อนกลับแดชบอร์ด
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/admin/points/create")}
                    >
                        ➕ เพิ่มจุดใหม่
                    </Button>
                </Box>

                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ลำดับ</strong></TableCell>
                                <TableCell><strong>ชื่อ</strong></TableCell>
                                <TableCell><strong>คำอธิบาย</strong></TableCell>
                                <TableCell><strong>สัญลักษณ์</strong></TableCell>
                                <TableCell><strong>จัดการ</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {points.map((point, index) => (
                                <TableRow key={point.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{point.name}</TableCell>
                                    <TableCell>{point.description}</TableCell>
                                    <TableCell>{point.sym}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleEdit(point.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            แก้ไข
                                        </Button>
                                        <Button
                                            color="error"
                                            onClick={() => handleDelete(point.id)}
                                        >
                                            ลบ
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminManagePoints;
