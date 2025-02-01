        const API_URL = "http://localhost:3000/api/songs";  // Cập nhật đường dẫn API của bạn
    
        // 🚀 Lấy danh sách bài hát từ API
        async function fetchSongs() {
            const res = await fetch(API_URL);
            const songs = await res.json();
            let html = "";
            songs.forEach(song => {
                html += `
                    <tr>
                        <td>${song.musicName}</td>
                        <td>${song.singer}</td>
                        <td>${song.category}</td>
                        <td><audio controls><source src="/uploads/audio/${song.audio}" type="audio/mp3"></audio></td>
                        <td><img src="/uploads/images/${song.image}" alt="Ảnh bài hát" width="50" height="50"></td>
                        <td>
                            <button onclick="openEditModal('${song._id}', '${song.musicName}', '${song.singer}', '${song.category}')">✏ Sửa</button>
                            <button onclick="deleteSong('${song._id}')">🗑 Xóa</button>
                        </td>
                    </tr>
                `;
            });
            document.getElementById("songs-list").innerHTML = html;
        }
    
        // 🚀 Mở Modal Thêm
        function toggleAddForm() {
            const form = document.getElementById("add-form-container");
            form.style.display = (form.style.display === "block") ? "none" : "block";
        }

        // 🚀 Thêm bài hát
        async function addSong(event) {
            event.preventDefault(); // Ngăn chặn form mặc định gửi
            let formData = new FormData();
            formData.append("musicName", document.getElementById("addMusicName").value);
            formData.append("singer", document.getElementById("addSinger").value);
            formData.append("category", document.getElementById("addCategory").value);
            formData.append("image", document.getElementById("addImage").files[0]);
            formData.append("audio", document.getElementById("addAudio").files[0]);

            await fetch(API_URL, { method: "POST", body: formData })
                .then(res => res.json())
                .then(() => {
                    toggleAddForm();
                    fetchSongs();
                });
        }
    
        // 🚀 Mở Modal Sửa
        function openEditModal(id, name, singer, category) {
            const form = document.getElementById("edit-form-container");
            form.style.display = "block";
            document.getElementById("edit-song-id").value = id;
            document.getElementById("edit-musicName").value = name;
            document.getElementById("edit-singer").value = singer;
            document.getElementById("edit-category").value = category;
        }
    
        // 🚀 Cập nhật bài hát
        async function updateSong(event) {
            event.preventDefault(); // Ngăn chặn form mặc định gửi
            let songId = document.getElementById("edit-song-id").value;
            let formData = new FormData();
            formData.append("musicName", document.getElementById("edit-musicName").value);
            formData.append("singer", document.getElementById("edit-singer").value);
            formData.append("category", document.getElementById("edit-category").value);
            formData.append("image", document.getElementById("edit-image").files[0]);
            formData.append("audio", document.getElementById("edit-audio").files[0]);

            await fetch(`${API_URL}/${songId}`, { method: "PUT", body: formData })
                .then(res => res.json())
                .then(() => {
                    toggleEditForm();
                    fetchSongs();
                });
        }

        // 🚀 Xóa bài hát
        async function deleteSong(id) {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" })
                .then(res => res.json())
                .then(() => fetchSongs());
        }
    
        // 🚀 Tắt Modal Sửa
        function toggleEditForm() {
            const form = document.getElementById("edit-form-container");
            form.style.display = (form.style.display === "block") ? "none" : "block";
        }
    
        // 🚀 Sử dụng DataTables cho bảng
        $(document).ready(function() {
            $('#songs-table').DataTable();
        });
    
        // 🧑‍🚀 Chạy khi tải trang
        document.getElementById("add-song-form").addEventListener("submit", addSong);
        document.getElementById("edit-song-form").addEventListener("submit", updateSong);

        fetchSongs(); // Lấy dữ liệu khi tải trang
