const express = require('express');
const router = express.Router();
const connection = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// API để lấy tất cả công tác
router.get('/', authMiddleware(), (req, res) => {
    connection.query('SELECT * FROM QT_CONGTAC', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để thêm một công tác mới
router.post('/', authMiddleware('admin'), (req, res) => {
    const { NV_MA, PB_MA, CV_MA, CT_BatDau, CT_KetThuc } = req.body;
    const query = `INSERT INTO QT_CONGTAC (NV_MA, PB_MA, CV_MA, CT_BatDau, CT_KetThuc) VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [NV_MA, PB_MA, CV_MA, CT_BatDau, CT_KetThuc], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = 'SELECT * FROM QT_CONGTAC WHERE CT_MA = ?';
        connection.query(querySelect, [result.insertId], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
                message: 'Công tác đã được thêm thành công',
                data: rows[0]
            });
        });
    });
});


// API để cập nhật thông tin của một công tác theo NV_MA, PB_MA và CV_MA
router.put('/:nv_ma/:pb_ma/:cv_ma', authMiddleware('admin'), (req, res) => {
    const { nv_ma, pb_ma, cv_ma } = req.params;
    const { CT_BatDau, CT_KetThuc } = req.body;
    const query = `UPDATE QT_CONGTAC SET CT_BatDau = ?, CT_KetThuc = ? WHERE NV_MA = ? AND PB_MA = ? AND CV_MA = ?`;
    connection.query(query, [CT_BatDau, CT_KetThuc, nv_ma, pb_ma, cv_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Thông tin công tác đã được cập nhật' });
    });
});

// API để xóa một công tác theo NV_MA, PB_MA và CV_MA
router.delete('/:nv_ma/:pb_ma/:cv_ma', authMiddleware('admin'), (req, res) => {
    const { nv_ma, pb_ma, cv_ma } = req.params;
    const query = `DELETE FROM QT_CONGTAC WHERE NV_MA = ? AND PB_MA = ? AND CV_MA = ?`;
    connection.query(query, [nv_ma, pb_ma, cv_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Công tác đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một công tác theo NV_MA, PB_MA và CV_MA
router.get('/:nv_ma/:pb_ma/:cv_ma', authMiddleware(), (req, res) => {
    const { nv_ma, pb_ma, cv_ma } = req.params;
    connection.query('SELECT * FROM QT_CONGTAC WHERE NV_MA = ? AND PB_MA = ? AND CV_MA = ?', [nv_ma, pb_ma, cv_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
