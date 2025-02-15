const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Song = require('../models/song');

const router = express.Router();

// Định nghĩa đường dẫn gốc cho thư mục uploads
const BASE_UPLOAD_PATH = 'C:/CODE/Project-1/uploads';

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        if (file.mimetype.startsWith('image')) {
            uploadPath = path.join(BASE_UPLOAD_PATH, 'images');
        } else if (file.mimetype.startsWith('audio')) {
            uploadPath = path.join(BASE_UPLOAD_PATH, 'audio');
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Tạo tên file duy nhất
    }
});

const upload = multer({ storage: storage });

// API: Lấy danh sách bài hát
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy danh sách bài hát!" });
    }
});

// API: Thêm bài hát mới
router.post('/', upload.fields([{ name: 'audio' }, { name: 'image' }]), async (req, res) => {
    try {
        const { musicName, singer, category } = req.body;
        const audio = req.files['audio'][0].filename;
        const image = req.files['image'][0].filename;

        const newSong = new Song({
            musicName,
            singer,
            category,
            audio,
            image
        });

        await newSong.save();
        res.status(201).json(newSong);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi thêm bài hát!" });
    }
});

// API: Xóa bài hát
router.delete('/:id', async (req, res) => {
    try {
        // Tìm bài hát trong database
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ error: "Bài hát không tồn tại!" });
        }

        // Xác định đường dẫn file
        const imagePath = path.join(BASE_UPLOAD_PATH, 'images', song.image);
        const audioPath = path.join(BASE_UPLOAD_PATH, 'audio', song.audio);

        console.log("Đường dẫn ảnh:", imagePath);
        console.log("Đường dẫn audio:", audioPath);

        // Xóa file ảnh nếu tồn tại
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
                console.log("Ảnh đã bị xóa");
            } catch (err) {
                console.error("Lỗi xóa ảnh:", err);
            }
        } else {
            console.log("Ảnh không tồn tại!");
        }

        // Xóa file âm thanh nếu tồn tại
        if (fs.existsSync(audioPath)) {
            try {
                fs.unlinkSync(audioPath);
                console.log("Audio đã bị xóa");
            } catch (err) {
                console.error("Lỗi xóa audio:", err);
            }
        } else {
            console.log("Audio không tồn tại!");
        }

        // Xóa bài hát khỏi database
        await Song.findByIdAndDelete(req.params.id);

        res.json({ message: "Bài hát và các tệp liên quan đã được xóa!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi xóa bài hát!" });
    }
});

// API: Cập nhật thông tin bài hát
router.put('/:id', upload.fields([{ name: 'audio' }, { name: 'image' }]), async (req, res) => {
    try {
        const { musicName, singer, category } = req.body;

        // Tìm bài hát theo _id
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ error: "Bài hát không tồn tại!" });
        }

        // Cập nhật thông tin bài hát
        song.musicName = musicName || song.musicName;
        song.singer = singer || song.singer;
        song.category = category || song.category;
        if (req.files['audio']) song.audio = req.files['audio'][0].filename;
        if (req.files['image']) song.image = req.files['image'][0].filename;

        await song.save();
        res.json(song);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi cập nhật bài hát!" });
    }
});

module.exports = router;
