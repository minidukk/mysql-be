const express = require('express');
const router = express.Router();
const connection = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// API để lấy tất cả lương
router.get('/', authMiddleware(), (req, res) => {
    connection.query('SELECT * FROM DM_LUONG', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để thêm một lương mới
router.post('/', authMiddleware('admin'), (req, res) => {
    const { NV_MA, LUONG_LuongCoBan, LUONG_PhuCap, LUONG_KhauTruThue, LUONG_BatDau, LUONG_KetThuc } = req.body;
    const query = `INSERT INTO DM_LUONG (NV_MA, LUONG_LuongCoBan, LUONG_PhuCap, LUONG_KhauTruThue, LUONG_BatDau, LUONG_KetThuc) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(query, [NV_MA, LUONG_LuongCoBan, LUONG_PhuCap, LUONG_KhauTruThue, LUONG_BatDau, LUONG_KetThuc], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = 'SELECT * FROM DM_LUONG WHERE NV_MA = ?';
        connection.query(querySelect, [NV_MA], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
                message: 'DMLương đã được thêm thành công',
                data: rows[0]
            });
        });
    });
});

// API để cập nhật thông tin của một lương theo NV_MA
router.put('/:nv_ma', authMiddleware('admin'), (req, res) => {
    const { nv_ma } = req.params;
    const { LUONG_LuongCoBan, LUONG_PhuCap, LUONG_KhauTruThue, LUONG_BatDau, LUONG_KetThuc } = req.body;
    const query = `UPDATE DM_LUONG SET LUONG_LuongCoBan = ?, LUONG_PhuCap = ?, LUONG_KhauTruThue = ?, LUONG_BatDau = ?, LUONG_KetThuc = ? WHERE NV_MA = ?`;
    connection.query(query, [LUONG_LuongCoBan, LUONG_PhuCap, LUONG_KhauTruThue, LUONG_BatDau, LUONG_KetThuc, nv_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Thông tin lương đã được cập nhật' });
    });
});

// API để xóa một lương theo NV_MA
router.delete('/:nv_ma', authMiddleware('admin'), (req, res) => {
    const { nv_ma } = req.params;
    const query = `DELETE FROM DM_LUONG WHERE NV_MA = ?`;
    connection.query(query, [nv_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Lương đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một lương theo NV_MA
router.get('/:nv_ma', authMiddleware(), (req, res) => {
    const { nv_ma } = req.params;
    connection.query('SELECT * FROM DM_LUONG WHERE NV_MA = ?', [nv_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
