const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // โหลดค่าจาก .env

const SECRET_KEY = process.env.JWT_SECRET || 'defaultsecret'; // อ่านจาก .env

module.exports = (pool) => {
    // LOGIN
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;

        try {
            const result = await pool.query(
                'SELECT * FROM admins WHERE username = $1',
                [username]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
            }

            const admin = result.rows[0];
            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
            }

            const token = jwt.sign({ id: admin.id }, SECRET_KEY, { expiresIn: '2h' });

            res.json({
                success: true,
                token,
                admin: { id: admin.id, username: admin.username }
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
        }
    });

    // Middleware ตรวจสอบ Token
    const authenticate = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'ไม่มี token แนบมา' });

        const token = authHeader.split(' ')[1];

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'token ไม่ถูกต้อง' });

            req.adminId = decoded.id;
            next();
        });
    };

    // GET CURRENT ADMIN
    router.get('/me', authenticate, async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT id, username FROM admins WHERE id = $1',
                [req.adminId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'ไม่พบแอดมิน' });
            }

            res.json(result.rows[0]);
        } catch (err) {
            console.error('Fetch admin error:', err);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
        }
    });

    // UPDATE ADMIN
    router.put('/me', authenticate, async (req, res) => {
        const { username, password } = req.body;

        try {
            const hash = await bcrypt.hash(password, 10);
            await pool.query(
                'UPDATE admins SET username = $1, password = $2 WHERE id = $3',
                [username, hash, req.adminId]
            );

            res.json({ success: true, message: 'อัปเดตเรียบร้อยแล้ว' });
        } catch (err) {
            console.error('Update admin error:', err);
            res.status(500).json({ success: false, message: 'อัปเดตไม่สำเร็จ' });
        }
    });

    return router;
};
