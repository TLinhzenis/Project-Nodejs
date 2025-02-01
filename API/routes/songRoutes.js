const express = require('express');
const multer = require('multer');
const path = require('path');
const Song = require('../models/song');

const router = express.Router();

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, './uploads/images');
        } else if (file.mimetype.startsWith('audio')) {
            cb(null, './uploads/audio');
        }
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
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) {
            return res.status(404).json({ error: "Bài hát không tồn tại!" });
        }
        res.json({ message: "Bài hát đã được xóa!" });
    } catch (err) {
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