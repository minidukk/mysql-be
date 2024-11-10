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
    const { NV_Ma, PB_Ma, CV_Ma, CT_BatDau, CT_KetThuc } = req.body;
    const query = `INSERT INTO QT_CONGTAC (NV_Ma, PB_Ma, CV_Ma, CT_BatDau, CT_KetThuc) VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [NV_Ma, PB_Ma, CV_Ma, CT_BatDau, CT_KetThuc], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = 'SELECT * FROM QT_CONGTAC WHERE NV_Ma = ?';
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


router.put('/:nv_ma/:pb_ma/:cv_ma', authMiddleware('admin'), (req, res) => {
    const { nv_ma, pb_ma, cv_ma } = req.params;
    const { CT_BatDau, CT_KetThuc } = req.body;

    // Câu truy vấn để cập nhật thông tin công tác
    const updateQuery = `UPDATE QT_CONGTAC SET CT_BatDau = ?, CT_KetThuc = ? WHERE NV_Ma = ? AND PB_Ma = ? AND CV_Ma = ?`;

    connection.query(updateQuery, [CT_BatDau, CT_KetThuc, nv_ma, pb_ma, cv_ma], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }

        // Kiểm tra nếu có bản ghi được cập nhật
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy công tác cần cập nhật' });
        }

        // Truy vấn lại đối tượng vừa cập nhật để lấy dữ liệu mới nhất
        const selectQuery = `SELECT NV_Ma, PB_Ma, CV_Ma, CT_BatDau, CT_KetThuc FROM QT_CONGTAC WHERE NV_Ma = ? AND PB_Ma = ? AND CV_Ma = ?`;
        connection.query(selectQuery, [nv_ma, pb_ma, cv_ma], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy công tác sau khi cập nhật' });
            }
            // Trả về đối tượng đã cập nhật thành công
            res.json({
                message: 'Thông tin công tác đã được cập nhật thành công',
                updatedData: rows[0], // Đối tượng đã cập nhật
            });
        });
    });
});


// API để xóa một công tác theo NV_Ma, PB_Ma và CV_Ma
router.delete('/:nv_ma/:pb_ma/:cv_ma', authMiddleware('admin'), (req, res) => {
    const { nv_ma, pb_ma, cv_ma } = req.params;
    const query = `DELETE FROM QT_CONGTAC WHERE NV_Ma = ? AND PB_Ma = ? AND CV_Ma = ?`;
    connection.query(query, [nv_ma, pb_ma, cv_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Công tác đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một công tác theo NV_Ma, PB_Ma và CV_Ma
router.get('/:nv_ma/:pb_ma/:cv_ma', authMiddleware(), (req, res) => {
    const { nv_ma, pb_ma, cv_ma } = req.params;
    connection.query('SELECT * FROM QT_CONGTAC WHERE NV_Ma = ? AND PB_Ma = ? AND CV_Ma = ?', [nv_ma, pb_ma, cv_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
