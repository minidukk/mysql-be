const express = require('express');
const router = express.Router();
const connection = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// API để lấy tất cả lương
router.get('/', authMiddleware(), (req, res) => {
    connection.query('SELECT * FROM LUONG', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để thêm một lương mới
router.post('/', authMiddleware('admin'), (req, res) => {
    const { NV_Ma, NN_Ma, L_ThangNam, L_SoBuoiLam, L_LuongThucLanh } = req.body;
    const query = `INSERT INTO LUONG (NV_Ma, NN_Ma, L_ThangNam, L_SoBuoiLam, L_LuongThucLanh) VALUES (?, ?, ?, ?, ?)`;
    connection.query(query, [NV_Ma, NN_Ma, L_ThangNam, L_SoBuoiLam, L_LuongThucLanh], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = `SELECT * FROM LUONG WHERE NV_Ma = ? AND NN_Ma = ?`;
        connection.query(querySelect, [NV_Ma, NN_Ma], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                message: 'Lương đã được thêm thành công',
                data: rows[0]
            });
        });
    });
});

// API để cập nhật thông tin của một lương theo NV_Ma và NN_Ma
router.put('/:nv_ma/:nn_ma', authMiddleware('admin'), (req, res) => {
    const { nv_ma, nn_ma } = req.params;
    const { L_ThangNam, L_SoBuoiLam, L_LuongThucLanh } = req.body;
    const query = `UPDATE LUONG SET L_ThangNam = ?, L_SoBuoiLam = ?, L_LuongThucLanh = ? WHERE NV_Ma = ? AND NN_Ma = ?`;
    connection.query(query, [L_ThangNam, L_SoBuoiLam, L_LuongThucLanh, nv_ma, nn_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Thông tin lương đã được cập nhật' });
    });
});

// API để xóa một lương theo NV_Ma và NN_Ma
router.delete('/:nv_ma/:nn_ma', authMiddleware('admin'), (req, res) => {
    const { nv_ma, nn_ma } = req.params;
    const query = `DELETE FROM LUONG WHERE NV_Ma = ? AND NN_Ma = ?`;
    connection.query(query, [nv_ma, nn_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Lương đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một lương theo NV_Ma và NN_Ma
router.get('/:nv_ma/:nn_ma', authMiddleware(), (req, res) => {
    const { nv_ma, nn_ma } = req.params;
    connection.query('SELECT * FROM LUONG WHERE NV_Ma = ? AND NN_Ma = ?', [nv_ma, nn_ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
