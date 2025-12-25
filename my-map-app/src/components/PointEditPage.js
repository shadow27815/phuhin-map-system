import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import PointEditForm from "./PointEditForm";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const PointEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [point, setPoint] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/points/${id}`)
            .then((res) => {
                const data = res.data;
                setPoint({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    sym: data.sym,
                    lat: data.lat,
                    lng: data.lng,
                    image: data.image || null
                });
            })
            .catch(() => {
                navigate("/admin/manage");
            });
    }, [id, navigate]);

    const handleSuccess = () => {
        navigate("/admin/manage");
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Button onClick={() => navigate("/admin/manage")} variant="outlined">
                        🔙 กลับไปยังรายการจุดพิกัด
                    </Button>
                </Box>

                <Typography variant="h5" gutterBottom>
                    ✏️ แก้ไขจุดพิกัด
                </Typography>

                {point ? (
                    <PointEditForm pointId={id} onSuccess={handleSuccess} />
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <CircularProgress />
                    </Box>

                )}
            </Paper>
        </Container>
    );
};

export default PointEditPage;
