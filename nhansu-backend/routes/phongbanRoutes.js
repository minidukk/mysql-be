const express = require('express');
const router = express.Router();
const connection = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// API để lấy tất cả phòng ban
router.get('/', authMiddleware(), (req, res) => {
    connection.query('SELECT * FROM PHONGBAN', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để thêm một phòng ban mới
router.post('/', authMiddleware('admin'), (req, res) => {
    const { PB_Ma, PB_TenPhongBan, PB_VanPhong, PB_MaTruongPhong } = req.body;
    const query = `INSERT INTO PHONGBAN (PB_Ma, PB_TenPhongBan, PB_VanPhong, PB_MaTruongPhong) VALUES (?, ?, ?, ?)`;
    connection.query(query, [PB_Ma, PB_TenPhongBan, PB_VanPhong, PB_MaTruongPhong], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = `SELECT * FROM PHONGBAN WHERE PB_Ma = ?`;
        connection.query(querySelect, [PB_Ma], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(rows[0]);
            return res.status(200).json(rows[0]);
        });
    });
});

// API để cập nhật thông tin của một phòng ban theo PB_Ma
router.put('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const { PB_TenPhongBan, PB_VanPhong, PB_MaTruongPhong } = req.body;
    const query = `UPDATE PHONGBAN SET PB_TenPhongBan = ?, PB_VanPhong = ?, PB_MaTruongPhong = ? WHERE PB_Ma = ?`;
    connection.query(query, [PB_TenPhongBan, PB_VanPhong, PB_MaTruongPhong, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Thông tin phòng ban đã được cập nhật' });
    });
});

// API để xóa một phòng ban theo PB_Ma
router.delete('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM PHONGBAN WHERE PB_Ma = ?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Phòng ban đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một phòng ban theo PB_Ma
router.get('/:id', authMiddleware(), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM PHONGBAN WHERE PB_Ma = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
