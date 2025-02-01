const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const songRoutes = require('./API/routes/songRoutes');

// Khởi tạo ứng dụng Express
const app = express();
const PORT = 3000;

// Kết nối MongoDB Atlas
const mongoURI = "mongodb+srv://btuanlinh715:Btuanlinh715@cluster0.krja2.mongodb.net/MusicApp?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));  // Để truy cập file ảnh và audio

// Sử dụng routes cho bài hát
app.use('/api/songs', songRoutes);

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
