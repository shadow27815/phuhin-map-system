const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const app = express();

// ✅ ตั้งค่า storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // .jpg / .png / .heic
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${Date.now()}_${baseName}${ext}`); // เก็บชื่อไฟล์ตามนามสกุลเดิมก่อน
    },
});

// ✅ ตัวกรองเฉพาะภาพ
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed.'));
    }
};

const upload = multer({ storage, fileFilter });

// ✅ ฟังก์ชันแปลง HEIC → JPEG
const convertHEICtoJPEG = async (filePath) => {
    const newFilePath = filePath.replace(/\.(heic|heif)$/i, '.jpg');
    try {
        await sharp(filePath).toFormat('jpeg').toFile(newFilePath);
        fs.unlinkSync(filePath); // ลบไฟล์ HEIC เดิม
        return newFilePath;
    } catch (err) {
        throw new Error('Failed to convert HEIC: ' + err.message);
    }
};

// ✅ Route สำหรับอัปโหลด
app.post('/upload', upload.single('image'), async (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const ext = path.extname(req.file.filename).toLowerCase();

    try {
        if (ext === '.heic' || ext === '.heif') {
            const newFilePath = await convertHEICtoJPEG(filePath);
            return res.json({ success: true, filePath: path.basename(newFilePath) });
        }

        res.json({ success: true, filePath: path.basename(filePath) });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ เปิดใช้งานเซิร์ฟเวอร์ (ถ้ายังไม่ได้เปิดไว้ในไฟล์อื่น)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server started at http://localhost:${PORT}`);
});
