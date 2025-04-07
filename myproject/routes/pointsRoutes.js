const express = require("express");
const multer = require("multer");
const path = require("path");
const {
    getPoints,
    getPointById,
    createPoint,
    updatePoint,
    deletePoint
} = require("../controllers/pointsController");

const router = express.Router();

// ตั้งค่าการอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    },
});
const upload = multer({ storage });

module.exports = (pool) => {
    // ✅ ดึงรายการทั้งหมด
    router.get("/", (req, res) => getPoints(pool, req, res));

    // ✅ ดึงจุดเดียวตาม ID
    router.get("/:id", (req, res) => getPointById(pool, req, res));

    // ✅ เพิ่มจุด
    router.post("/", upload.single("image"), (req, res) => createPoint(pool, req, res));

    // ✅ แก้ไขจุด
    router.put("/:id", upload.single("image"), (req, res) => updatePoint(pool, req, res));

    // ✅ ลบจุด
    router.delete("/:id", (req, res) => deletePoint(pool, req, res));

    return router;
};
