const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.json());

// kết nối
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// routes
const chucvuRoutes = require('./routes/chucvuRoutes');
const congtacRoutes = require('./routes/congtacRoutes');
const dmluongRoutes = require('./routes/dmluongRoutes');
const luongRoutes = require('./routes/luongRoutes');
const nghiphepRoutes = require('./routes/nghiphepRoutes');
const nhanvienRoutes = require('./routes/nhanvienRoutes');
const phongbanRoutes = require('./routes/phongbanRoutes');
const authRoutes = require('./routes/auth');

app.use('/api/chucvus', chucvuRoutes);
app.use('/api/congtacs', congtacRoutes);
app.use('/api/dmluongs', dmluongRoutes);
app.use('/api/luongs', luongRoutes);
app.use('/api/nghiphep', nghiphepRoutes);
app.use('/api/nhanviens', nhanvienRoutes);
app.use('/api/phongbans', phongbanRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
