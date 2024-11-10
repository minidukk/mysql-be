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
    const { CV_Ma, CV_TenCV, CV_HSL } = req.body;
    const query = `INSERT INTO DM_CHUCVU (CV_Ma, CV_TenCV, CV_HSL) VALUES (?, ?, ?)`;
    connection.query(query, [CV_Ma, CV_TenCV, CV_HSL], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = 'SELECT * FROM DM_CHUCVU WHERE CV_Ma = ?';
        connection.query(querySelect, [CV_Ma], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(rows[0]);
        })
       // res.json({ message: 'Chức vụ đã được thêm thành công', id: result.insertId });
    });
});

// API để cập nhật thông tin của một chức vụ theo CV_Ma
router.put('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const { CV_TenCV, CV_HSL } = req.body;
<<<<<<< HEAD
    const updateQuery = `UPDATE DM_CHUCVU SET CV_TenCV = ?, CV_HSL = ? WHERE CV_Ma = ?`;

    connection.query(updateQuery, [CV_TenCV, CV_HSL, id], (err, result) => {
=======
    const query = `UPDATE DM_CHUCVU SET CV_TenCV = ?, CV_HSL = ? WHERE CV_Ma = ?`;
    connection.query(query, [CV_TenCV, CV_HSL, id], (err, result) => {
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Nếu cập nhật thành công, truy vấn để lấy đối tượng vừa cập nhật
        const selectQuery = `SELECT * FROM DM_CHUCVU WHERE CV_Ma = ?`;
        connection.query(selectQuery, [id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Trả về đối tượng đã được cập nhật
            res.status(200).json({ message: 'Chức vụ đã được cập nhật', updatedData: rows[0] });
        });
    });
});

// API để xóa một chức vụ theo CV_Ma
router.delete('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM DM_CHUCVU WHERE CV_Ma = ?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Chức vụ đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một chức vụ theo CV_Ma
router.get('/:id', authMiddleware(), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM DM_CHUCVU WHERE CV_Ma = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
