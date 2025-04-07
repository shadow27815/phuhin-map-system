const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${Date.now()}_${baseName}.jpg`); // บันทึกเป็น .jpg
    },
});

const upload = multer({ storage: storage });

const convertHEICtoJPEG = async (filePath) => {
    const newFilePath = filePath.replace(/\.heic$/i, '.jpg');
    await sharp(filePath).toFormat('jpeg').toFile(newFilePath);
    fs.unlinkSync(filePath); // ลบไฟล์ HEIC เดิม
    return newFilePath;
};

app.post('/upload', upload.single('image'), async (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    if (path.extname(req.file.filename).toLowerCase() === '.heic') {
        try {
            const newFilePath = await convertHEICtoJPEG(filePath);
            res.send({ success: true, filePath: newFilePath });
        } catch (error) {
            console.error('Error converting HEIC:', error);
            res.status(500).send('Failed to process image.');
        }
    } else {
        res.send({ success: true, filePath });
    }
});
