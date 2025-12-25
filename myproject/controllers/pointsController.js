const fs = require("fs");
const path = require("path");

// ✅ ดึงจุดพิกัดทั้งหมด
exports.getPoints = async (pool, req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, ST_AsGeoJSON(geom) AS geometry, name, description, sym, image
            FROM "My points"
            ORDER BY id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching points:", error);
        res.status(500).send("Server Error");
    }
};

// ✅ ดึงจุดพิกัดจาก ID เดียว
exports.getPointById = async (pool, req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
                id,
                name,
                description,
                sym,
                image,
                ST_Y(geom) AS lat,
                ST_X(geom) AS lng
            FROM "My points"
            WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "ไม่พบข้อมูล" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching point by ID:", error);
        res.status(500).json({ error: "ไม่สามารถโหลดข้อมูลได้" });
    }
};

// ✅ เพิ่มจุดพิกัดใหม่
exports.createPoint = async (pool, req, res) => {
    try {
        const { name, description, sym, lat, lng } = req.body;
        const image = req.file ? req.file.filename : null;

        const query = `
            INSERT INTO "My points" (geom, name, description, sym, image)
            VALUES (ST_SetSRID(ST_MakePoint($1, $2), 4326), $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [lng, lat, name, description, sym, image];
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error creating point:", error);
        res.status(500).send("Server Error");
    }
};

// ✅ แก้ไขจุดพิกัด
exports.updatePoint = async (pool, req, res) => {
    try {
        const { id } = req.params;
        const { name, description, sym, lat, lng, existingImage } = req.body;

        let image = existingImage; // รูปเก่าใช้เป็นค่าตั้งต้น
        if (req.file) {
            image = req.file.filename;

            // ✅ ลบไฟล์เก่า (ถ้ามี)
            if (existingImage) {
                const oldPath = path.join(__dirname, "../uploads", existingImage);
                fs.unlink(oldPath, (err) => {
                    if (err && err.code !== "ENOENT") {
                        console.error("⚠️ Error deleting old image:", err);
                    }
                });
            }
        }

        const query = `
            UPDATE "My points"
            SET geom = ST_SetSRID(ST_MakePoint($1, $2), 4326),
                name = $3,
                description = $4,
                sym = $5,
                image = $6
            WHERE id = $7
            RETURNING *
        `;
        const values = [lng, lat, name, description, sym, image, id];
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating point:", error);
        res.status(500).send("Server Error");
    }
};

// ✅ ลบจุดพิกัด (พร้อมลบรูป)
exports.deletePoint = async (pool, req, res) => {
    try {
        const { id } = req.params;

        // หาชื่อไฟล์รูปก่อนลบ
        const result = await pool.query(`SELECT image FROM "My points" WHERE id = $1`, [id]);
        const image = result.rows[0]?.image;

        // ลบข้อมูลใน DB
        await pool.query(`DELETE FROM "My points" WHERE id = $1`, [id]);

        // ลบรูปภาพจากโฟลเดอร์
        if (image) {
            const imagePath = path.join(__dirname, "../uploads", image);
            fs.unlink(imagePath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.error("⚠️ Error deleting image file:", err);
                }
            });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting point:", error);
        res.status(500).send("Server Error");
    }
};
