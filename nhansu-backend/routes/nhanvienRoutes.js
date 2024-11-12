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
    const {NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau } = req.body;
    console.log(NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau);
    const query = `CALL sp_ThemNV(?, ?, ?, ?, ?)`;
    connection.query(query, [NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        }
        const querySelect = `SELECT * FROM NHANVIEN WHERE NV_SDT = ?`;
        connection.query(querySelect, [NV_SDT], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
                message: 'Nhân viên đã được thêm thành công',
                data: rows[0]
            });
        });
    });
});

// API để cập nhật thông tin của một nhân viên theo NV_Ma
router.put('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const { NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau } = req.body;
    const query = `CALL sp_CapNhatThongTinNV(?, ?, ?, ?, ?, ?)`;
    connection.query(query, [id, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }

        // Nếu cập nhật thành công, thực hiện truy vấn để lấy thông tin nhân viên vừa được cập nhật
        const selectQuery = `SELECT * FROM NHANVIEN WHERE NV_Ma = ?`;
        connection.query(selectQuery, [id], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }

            // Trả về đối tượng đã được cập nhật
            res.status(200).json({ message: 'Thông tin nhân viên đã được cập nhật', updatedData: rows[0] });
        });
    });
});

// API để xóa một nhân viên theo NV_Ma
router.delete('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const query = `CALL sp_XoaNV(?)`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Nhân viên đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một nhân viên theo NV_Ma
router.get('/:id', authMiddleware(), (req, res) => {
    const { id } = req.params;
    connection.query('call sp_ThongTinNV(?)', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

// API để lấy danh sách nhân viên theo phòng ban (PB_Ma)
router.get('/phongban/:pb_Ma', authMiddleware(), (req, res) => {
    const { pb_Ma } = req.params;
    const query = `CALL sp_NhanVienCuaPB(?)`;
    connection.query(query, [pb_Ma], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API để lấy vai trò hiện tại của một nhân viên theo NV_Ma
router.get('/:id/role', authMiddleware(), (req, res) => {
    const { id } = req.params;
    const query = `SELECT CV_Ma, PB_Ma, CT_BatDau, CT_KetThuc FROM QT_CONGTAC WHERE NV_Ma = ? AND CT_KetThuc IS NULL`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

// API để lấy thông tin lương của một nhân viên theo NV_Ma
router.get('/:id/salary', authMiddleware(), (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM DM_LUONG WHERE NV_Ma = ?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

// API để lấy danh sách ngày nghỉ phép của một nhân viên theo NV_Ma
router.get('/:id/leaves', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM NGAY_NGHI_PHEP WHERE NV_Ma = ?`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
