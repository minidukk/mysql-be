const express = require('express');
const router = express.Router();
const connection = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// API để lấy tất cả ngày nghỉ phép
router.get('/', authMiddleware(), (req, res) => {
    const query = `
        SELECT 
            NG.NN_Ma,
            NG.NV_Ma,
            NV.NV_TenNV,
            NV.NV_SDT,
            NV.NV_DiaChi,
            NV.NV_Role,
            NG.NN_SoNgayNghi,
            NG.NN_GhiChu
        FROM 
            NGAY_NGHI_PHEP NG
        JOIN 
            NHANVIEN NV ON NG.NV_Ma = NV.NV_Ma;
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


// API để thêm một ngày nghỉ mới
router.post('/', authMiddleware(), (req, res) => {
    const { NN_Ma, NV_Ma, NN_SoNgayNghi, NN_GhiChu } = req.body;
    const query = `INSERT INTO NGAY_NGHI_PHEP (NN_Ma, NV_Ma, NN_SoNgayNghi, NN_GhiChu) VALUES (?, ?, ?, ?)`;
    connection.query(query, [NN_Ma, NV_Ma, NN_SoNgayNghi, NN_GhiChu], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = `SELECT * FROM NGAY_NGHI_PHEP WHERE NN_Ma = ? AND NV_Ma = ?`;
        connection.query(querySelect, [NN_Ma, NV_Ma], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                message: 'Nghỉ phép đã được thêm thành công',
                data: rows[0]
            });
        });
    });
});

// API để cập nhật thông tin của một ngày nghỉ theo NN_Ma và NV_Ma
<<<<<<< HEAD
router.put('/:nn_ma/:nv_ma', authMiddleware('admin'), (req, res) => {
    const { nn_ma, nv_ma } = req.params;
    const { NN_SoNgayNghi, NN_GhiChu } = req.body;
    const query = `UPDATE NGAY_NGHI_PHEP SET NN_SoNgayNghi = ?, NN_GhiChu = ? WHERE NN_Ma = ? AND NV_Ma = ?`;
    connection.query(query, [NN_SoNgayNghi, NN_GhiChu, nn_ma, nv_ma], (err, result) => {
=======
router.put('/:nn_Ma/:nv_Ma', authMiddleware('admin'), (req, res) => {
    const { nn_Ma, nv_Ma } = req.params;
    const { NN_SoNgayNghi, NN_GhiChu } = req.body;
    const query = `UPDATE NGAY_NGHI_PHEP SET NN_SoNgayNghi = ?, NN_GhiChu = ? WHERE NN_Ma = ? AND NV_Ma = ?`;
    connection.query(query, [NN_SoNgayNghi, NN_GhiChu, nn_Ma, nv_Ma], (err, result) => {
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Thông tin ngày nghỉ đã được cập nhật' });
    });
});

// API để xóa một ngày nghỉ theo NN_Ma và NV_Ma
<<<<<<< HEAD
router.delete('/:nn_ma/:nv_ma', authMiddleware('admin'), (req, res) => {
    const { nn_ma, nv_ma } = req.params;
    const query = `DELETE FROM NGAY_NGHI_PHEP WHERE NN_Ma = ? AND NV_Ma = ?`;
    connection.query(query, [nn_ma, nv_ma], (err, result) => {
=======
router.delete('/:nn_Ma/:nv_Ma', authMiddleware('admin'), (req, res) => {
    const { nn_Ma, nv_Ma } = req.params;
    const query = `DELETE FROM NGAY_NGHI_PHEP WHERE NN_Ma = ? AND NV_Ma = ?`;
    connection.query(query, [nn_Ma, nv_Ma], (err, result) => {
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Ngày nghỉ đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một ngày nghỉ theo NN_Ma và NV_Ma
<<<<<<< HEAD
router.get('/:nn_ma/:nv_ma', authMiddleware(), (req, res) => {
    const { nn_ma, nv_ma } = req.params;
    connection.query('SELECT * FROM NGAY_NGHI_PHEP WHERE NN_Ma = ? AND NV_Ma = ?', [nn_ma, nv_ma], (err, result) => {
=======
router.get('/:nn_Ma/:nv_Ma', authMiddleware(), (req, res) => {
    const { nn_Ma, nv_Ma } = req.params;
    connection.query('SELECT * FROM NGAY_NGHI_PHEP WHERE NN_Ma = ? AND NV_Ma = ?', [nn_Ma, nv_Ma], (err, result) => {
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

module.exports = router;
