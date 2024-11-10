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
<<<<<<< HEAD
    const { NV_Ma, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT } = req.body;
    const query = `INSERT INTO NHANVIEN (NV_Ma, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT) VALUES (?, ?, ?, ?, ?)`;
    connection.query(query, [NV_Ma, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT], (err, result) => {
=======
    const { NV_Ma, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau } = req.body;
    const query = `CALL sp_ThemNV(?, ?, ?, ?, ?, ?)`;
    connection.query(query, [NV_Ma, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau], (err, result) => {
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const querySelect = `SELECT * FROM NHANVIEN WHERE NV_Ma = ?`;
        connection.query(querySelect, [NV_Ma], (err, rows) => {
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

// API để cập nhật thông tin của một nhân viên theo NV_Ma
router.put('/:id', authMiddleware('admin'), (req, res) => {
    const { id } = req.params;
<<<<<<< HEAD
    const { NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT } = req.body;
    const updateQuery = `UPDATE NHANVIEN SET NV_TenNV = ?, NV_NgaySinh = ?, NV_DiaChi = ?, NV_SDT = ? WHERE NV_Ma = ?`;

    connection.query(updateQuery, [NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, id], (err, result) => {
=======
    const { NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau } = req.body;
    const query = `CALL sp_CapNhatThongTinNV(?, ?, ?, ?, ?, ?)`;
    connection.query(query, [id, NV_TenNV, NV_NgaySinh, NV_DiaChi, NV_SDT, NV_MatKhau], (err, result) => {
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Nếu cập nhật thành công, thực hiện truy vấn để lấy thông tin nhân viên vừa được cập nhật
        const selectQuery = `SELECT * FROM NHANVIEN WHERE NV_Ma = ?`;
        connection.query(selectQuery, [id], (err, rows) => {
            if (err) {
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
<<<<<<< HEAD
    const query = `DELETE FROM NHANVIEN WHERE NV_Ma = ?`;
=======
    const query = `CALL sp_XoaNV(?)`;
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
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
<<<<<<< HEAD
    connection.query('SELECT * FROM NHANVIEN WHERE NV_Ma = ?', [id], (err, result) => {
=======
    connection.query('call sp_ThongTinNV(?)', [id], (err, result) => {
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

// API để lấy danh sách nhân viên theo phòng ban (PB_Ma)
<<<<<<< HEAD
router.get('/phongban/:pb_ma', authMiddleware(), (req, res) => {
    const { pb_ma } = req.params;
    const query = `SELECT * FROM NHANVIEN n JOIN QT_CONGTAC q ON n.NV_Ma = q.NV_Ma WHERE q.PB_Ma = ?`;
    connection.query(query, [pb_ma], (err, results) => {
=======
router.get('/phongban/:pb_Ma', authMiddleware(), (req, res) => {
    const { pb_Ma } = req.params;
    const query = `CALL sp_NhanVienCuaPB(?)`;
    connection.query(query, [pb_Ma], (err, results) => {
>>>>>>> 9a51ce3e5c1560330ad685df8c53b421632a954c
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
