import React from "react";
import { Container, Paper, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PointCreateForm from "./PointCreateForm";

const PointCreatePage = () => {
    const navigate = useNavigate();

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
                    ➕ เพิ่มจุดพิกัดใหม่
                </Typography>

                <PointCreateForm onSuccess={handleSuccess} />
            </Paper>
        </Container>
    );
};

export default PointCreatePage;
