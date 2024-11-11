const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const router = express.Router();

// Đăng ký
router.post('/register', (req, res) => {
    const { NV_Ma, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau } = req.body;

    const query = 'INSERT INTO NHANVIEN (NV_Ma, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau, NV_Role, NV_KiemDuyet) VALUES (?, ?, ?, ?, ?, ?, "user", 0)';
    connection.query(query, [NV_Ma, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Đăng ký thành công', id: result.insertId });
    });
});

// Đăng nhập
router.post('/login', (req, res) => {
    const { NV_Ma, NV_MatKhau } = req.body;

    const query = 'SELECT * FROM NHANVIEN WHERE NV_Ma = ?';
    connection.query(query, [NV_Ma], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Tài khoản không tồn tại' });

        const user = results[0];
        
        if (user.NV_MatKhau !== NV_MatKhau) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }
        if (user.NV_KiemDuyet !== 1) {
            return res.status(403).json({ message: 'Tài khoản chưa được duyệt. Vui lòng liên hệ quản trị viên.' });
        }
        const token = jwt.sign({ id: user.NV_Ma, role: user.NV_Role }, 'giapminhduc', { expiresIn: '1h' });

        res.json({ token, user: { NV_Ma: user.NV_Ma, NV_TenNV: user.NV_TenNV, NV_Role: user.NV_Role } });
    });
});

// Lấy thông tin người dùng
router.get('/me', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Không có token' });

    jwt.verify(token, 'giapminhduc', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ' });

        const query = `
            SELECT 
                NV.NV_Ma, 
                NV.NV_TenNV, 
                NV.NV_NgaySinh, 
                NV.NV_DiaChi, 
                NV.NV_SDT, 
                NV.NV_MatKhau, 
                NV.NV_Role, 
                NV.NV_KiemDuyet, 
                PB.PB_Ma, 
                PB.PB_TenPhongBan, 
                PB.PB_VanPhong, 
                CV.CV_Ma, 
                CV.CV_TenCV, 
                CV.CV_HSL, 
                QT.CT_BatDau, 
                QT.CT_KetThuc
            FROM 
                NHANVIEN NV
            JOIN 
                QT_CONGTAC QT ON NV.NV_Ma = QT.NV_Ma
            JOIN 
                PHONGBAN PB ON QT.PB_Ma = PB.PB_Ma
            JOIN 
                DM_CHUCVU CV ON QT.CV_Ma = CV.CV_Ma
            ORDER BY 
                NV.NV_Ma
        `;
        connection.query(query, [decoded.id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ message: 'Người dùng không tồn tại' });

            res.json(results[0]);
        });
    });
});

module.exports = router;
