const express = require('express');
const User = require('../User'); // Import model User
const router = express.Router();

// API: Lấy danh sách người dùng
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy dữ liệu!" });
    }
});

// API: Thêm người dùng mới
router.post('/users', async (req, res) => {
    try {
        const { id, username, role } = req.body;
        if (!id || !username || !role) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin!" });
        }

        const userExists = await User.findOne({ id });
        if (userExists) {
            return res.status(409).json({ error: "ID đã tồn tại!" });
        }

        const newUser = new User({ id, username, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi thêm người dùng!" });
    }
});

// API: Xóa người dùng theo ID
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findOneAndDelete({ id });

        if (!deletedUser) {
            return res.status(404).json({ error: "Người dùng không tồn tại!" });
        }

        res.json({ message: "Xóa người dùng thành công!" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi xóa người dùng!" });
    }
});

module.exports = router;
    