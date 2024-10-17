const express = require('express');
const router = express.Router();
const connection = require('../db');

// API để lấy tất cả chức vụ
router.get('/', (req, res) => {
    connection.query('SELECT * FROM DM_CHUCVU', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để thêm một chức vụ mới
router.post('/', (req, res) => {
    const { CV_MA, CV_TenCV, CV_HSL } = req.body;
    const query = `INSERT INTO DM_CHUCVU (CV_MA, CV_TenCV, CV_HSL) VALUES (?, ?, ?)`;
    connection.query(query, [CV_MA, CV_TenCV, CV_HSL], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Chức vụ đã được thêm thành công', id: result.insertId });
    });
});

// API để cập nhật thông tin của một chức vụ theo CV_MA
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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
router.get('/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM DM_CHUCVU WHERE CV_MA = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
