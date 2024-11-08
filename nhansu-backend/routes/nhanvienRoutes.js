const express = require('express');
const router = express.Router();
const connection = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// API để lấy tất cả nhân viên
router.get('/', authMiddleware(), (req, res) => {
    connection.query('SELECT * FROM NHANVIEN', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để thêm một nhân viên mới
router.post('/', authMiddleware('admin'), (req, res) => {
    const { NV_MA, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT } = req.body;
    const query = `INSERT INTO NHANVIEN (NV_MA, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT) VALUES (?, ?, ?, ?, ?)`;
    connection.query(query, [NV_MA, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = `SELECT * FROM NHANVIEN WHERE NV_MA = ?`;
        connection.query(querySelect, [NV_MA], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
                message: 'Nhân viên đã được thêm thành công',
                data: rows[0]
            });
        });
    });
});

// API để cập nhật thông tin của một nhân viên theo NV_MA
router.put('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const { NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT } = req.body;
    const query = `UPDATE NHANVIEN SET NV_TenNV = ?, NV_NgaySinh = ?, NV_DiaChi = ?, NV_SDT = ? WHERE NV_MA = ?`;
    connection.query(query, [NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Thông tin nhân viên đã được cập nhật' });
    });
});

// API để xóa một nhân viên theo NV_MA
router.delete('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM NHANVIEN WHERE NV_MA = ?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Nhân viên đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một nhân viên theo NV_MA
router.get('/:id', authMiddleware(), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM NHANVIEN WHERE NV_MA = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

// API để lấy danh sách nhân viên theo phòng ban (PB_MA)
router.get('/phongban/:pb_ma', authMiddleware(), (req, res) => {
    const { pb_ma } = req.params;
    const query = `SELECT * FROM NHANVIEN n JOIN QT_CONGTAC q ON n.NV_MA = q.NV_MA WHERE q.PB_MA = ?`;
    connection.query(query, [pb_ma], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để lấy vai trò hiện tại của một nhân viên theo NV_MA
router.get('/:id/role', authMiddleware(), (req, res) => {
    const { id } = req.params;
    const query = `SELECT CV_MA, PB_MA, CT_BatDau, CT_KetThuc FROM QT_CONGTAC WHERE NV_MA = ? AND CT_KetThuc IS NULL`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

// API để lấy thông tin lương của một nhân viên theo NV_MA
router.get('/:id/salary', authMiddleware(), (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM DM_LUONG WHERE NV_MA = ?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

// API để lấy danh sách ngày nghỉ phép của một nhân viên theo NV_MA
router.get('/:id/leaves', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM NGAY_NGHI_PHEP WHERE NV_MA = ?`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
