const express = require('express');
const router = express.Router();
const connection = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// API để lấy tất cả chức vụ
router.get('/', authMiddleware(), (req, res) => {
    connection.query('SELECT * FROM DM_CHUCVU', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để thêm một chức vụ mới
router.post('/', authMiddleware('admin'), (req, res) => {
    const { CV_MA, CV_TenCV, CV_HSL } = req.body;
    const query = `INSERT INTO DM_CHUCVU (CV_MA, CV_TenCV, CV_HSL) VALUES (?, ?, ?)`;
    connection.query(query, [CV_MA, CV_TenCV, CV_HSL], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = 'SELECT * FROM DM_CHUCVU WHERE CV_MA = ?';
        connection.query(querySelect, [CV_MA], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(rows[0]);
        })
        res.json({ message: 'Chức vụ đã được thêm thành công', id: result.insertId });
    });
});

// API để cập nhật thông tin của một chức vụ theo CV_MA
router.put('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const { CV_TenCV, CV_HSL } = req.body;
    const query = `UPDATE DM_CHUCVU SET CV_TenCV = ?, CV_HSL = ? WHERE CV_MA = ?`;
    connection.query(query, [CV_TenCV, CV_HSL, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Thông tin chức vụ đã được cập nhật' });
    });
});

// API để xóa một chức vụ theo CV_MA
router.delete('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM DM_CHUCVU WHERE CV_MA = ?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Chức vụ đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một chức vụ theo CV_MA
router.get('/:id', authMiddleware(), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM DM_CHUCVU WHERE CV_MA = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
