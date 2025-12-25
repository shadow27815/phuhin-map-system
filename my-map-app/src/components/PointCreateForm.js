import React, { useState } from "react";
import {
    Box, Button, TextField, Typography, Paper, MenuItem, Stack, Snackbar, Alert
} from "@mui/material";
import axios from "axios";

const token = localStorage.getItem("adminToken");

const PointCreateForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "", description: "", sym: "", lat: "", lng: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => data.append(key, val));
            if (imageFile) data.append("image", imageFile);

            await axios.post(`${process.env.REACT_APP_API_URL}/api/points`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setSnackbar({ open: true, message: "✅ เพิ่มจุดพิกัดสำเร็จ", severity: "success" });
            if (onSuccess) onSuccess();
        } catch {
            setSnackbar({ open: true, message: "❌ เพิ่มจุดพิกัดไม่สำเร็จ", severity: "error" });
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">➕ เพิ่มจุดพิกัดใหม่</Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField label="ชื่อ" name="name" fullWidth required value={formData.name} onChange={handleChange} />
                    <TextField label="คำอธิบาย" name="description" fullWidth multiline value={formData.description} onChange={handleChange} />
                    <TextField label="สัญลักษณ์" name="sym" select fullWidth required value={formData.sym} onChange={handleChange}>
                        <MenuItem value="tourism-campingsite">⛺ camp</MenuItem>
                        <MenuItem value="transport-car">🚗 parking</MenuItem>
                        <MenuItem value="restaurant-coffee">☕ coffee</MenuItem>
                        <MenuItem value="stores-flowers">🌸 flower</MenuItem>
                        <MenuItem value="restaurant-restaurant">🍽️ restaurant</MenuItem>
                        <MenuItem value="sport-hiking">🥾 hiking</MenuItem>
                    </TextField>
                    <TextField label="ละติจูด (latitude)" name="lat" type="number" fullWidth required value={formData.lat} onChange={handleChange} />
                    <TextField label="ลองจิจูด (longitude)" name="lng" type="number" fullWidth required value={formData.lng} onChange={handleChange} />
                    <Button variant="outlined" component="label">📷 อัปโหลดรูปภาพ<input type="file" hidden onChange={handleFileChange} /></Button>
                    {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%" }} />}
                    <Button type="submit" variant="contained">บันทึกจุดพิกัด</Button>
                </Stack>
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default PointCreateForm;
