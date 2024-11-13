const express = require("express");
const router = express.Router();
const connection = require("../db");
const authMiddleware = require("../middlewares/authMiddleware");

// API để lấy tất cả lương
router.get('/', authMiddleware(), (req, res) => {
    const query = `
        SELECT 
            L.NN_Ma,
            L.NV_Ma,
            NV.NV_TenNV,
            NV.NV_SDT,
            NV.NV_DiaChi,
            NV.NV_Role,
            NP.NN_SoNgayNghi,
            NP.NN_GhiChu,
            L.L_ThangNam,
            L.L_SoBuoiLam,
            L.L_LuongThucLanh
        FROM 
            LUONG L
        JOIN 
            NHANVIEN NV ON L.NV_Ma = NV.NV_Ma
        JOIN 
            NGAY_NGHI_PHEP NP ON L.NN_Ma = NP.NN_Ma;
    `;
    
    connection.query(query, (err, results) => {
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
          message: "Lương đã được thêm thành công",
          data: rows[0],
        });
      });
    }
  );
});

// API để cập nhật thông tin của một lương theo NV_Ma và NN_Ma
router.put("/:nv_ma/:nn_ma", authMiddleware("admin"), (req, res) => {
  const { nv_ma, nn_ma } = req.params;
  const { L_ThangNam, L_SoBuoiLam, L_LuongThucLanh } = req.body;

  const updateQuery = `
        UPDATE LUONG 
        SET L_ThangNam = ?, L_SoBuoiLam = ?, L_LuongThucLanh = ? 
        WHERE NV_Ma = ? AND NN_Ma = ?
    `;

  // Thực hiện cập nhật
  connection.query(
    updateQuery,
    [L_ThangNam, L_SoBuoiLam, L_LuongThucLanh, nv_ma, nn_ma],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }

      // Kiểm tra xem có bản ghi nào được cập nhật không
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin lương để cập nhật" });
      }

      // Sau khi cập nhật thành công, lấy lại thông tin lương đã cập nhật
      const selectQuery = `SELECT * FROM LUONG WHERE NV_Ma = ? AND NN_Ma = ?`;
      connection.query(selectQuery, [nv_ma, nn_ma], (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Trả về bản ghi đã được cập nhật
        res.json({
          message: "Thông tin lương đã được cập nhật",
          updatedData: rows[0],
        });
      });
    }
  );
});

// API để xóa một lương theo NV_Ma và NN_Ma
router.delete('/:nv_Ma/:nn_Ma', authMiddleware('admin'), (req, res) => {
    const { nv_Ma, nn_Ma } = req.params;
    const query = `DELETE FROM LUONG WHERE NV_Ma = ? AND NN_Ma = ?`;
    connection.query(query, [nv_Ma, nn_Ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Lương đã được xóa' });
    });
});

// API để lấy thông tin chi tiết của một lương theo NV_Ma và NN_Ma
router.get('/:nv_Ma/:nn_Ma', authMiddleware(), (req, res) => {
    const { nv_Ma, nn_Ma } = req.params;
    connection.query('SELECT * FROM LUONG WHERE NV_Ma = ? AND NN_Ma = ?', [nv_Ma, nn_Ma], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

// API để lấy thông tin chi tiết của một lương theo NV_Ma
router.get('/:nv_Ma', authMiddleware(), (req, res) => {
  const { nv_Ma } = req.params;
  connection.query('SELECT * FROM LUONG WHERE NV_Ma = ?', [nv_Ma], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(result);
  });
});


router.get('/luong/:nv_Ma/:date', async (req, res) => {
    const { nv_Ma, date } = req.params;

    try {
        connection.query(
            `SELECT TinhLuongThucLanh(?, ?) AS luongThucLanh`,
            [nv_Ma, date],
            (error, result) => {
                if (error) {
                    console.error('Lỗi khi tính lương thực lãnh:', error);
                    return res.status(500).json({ error: 'Lỗi khi tính lương thực lãnh' });
                }

                const luongThucLanh = result[0]?.luongThucLanh;

                connection.query(
                    `SELECT * FROM v_ChiTietLuong WHERE NV_Ma = ? AND L_ThangNam = ?`,
                    [nv_Ma, date],
                    (error, chiTietLuong) => {
                        if (error) {
                            console.error('Lỗi khi lấy chi tiết lương:', error);
                            return res.status(500).json({ error: 'Lỗi khi lấy chi tiết lương' });
                        }
                        res.json({
                            luongThucLanh,
                            chiTietLuong
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Lỗi hệ thống:', error);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
});



module.exports = router;
