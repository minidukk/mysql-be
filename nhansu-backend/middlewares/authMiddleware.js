const jwt = require('jsonwebtoken');

// Middleware để kiểm tra token và quyền truy cập
const authMiddleware = (role) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Không có token' });

        jwt.verify(token, 'giapminhduc', (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
            
            req.user = decoded;

            if (role && decoded.role !== role) {
                return res.status(403).json({ message: 'Không đủ quyền truy cập' });
            }

            next();
        });
    };
};

module.exports = authMiddleware;
