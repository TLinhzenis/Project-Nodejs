const API_URL = "http://localhost:3000/api/songs";  // Cập nhật đường dẫn API của bạn
    
        // 🚀 Lấy danh sách bài hát từ API
        async function fetchSongs() {
            const res = await fetch(API_URL);
            const songs = await res.json();
            let html = "";
            songs.forEach(song => {
                html += `
                    <div class="media">
              <img style="width: 180px; height: 180px;" src="/uploads/images/${song.image}" alt="Image" class="mr-3">
              <div class="media-body tm-bg-gray">
                <div class="tm-description-box">
                  <h5 class="tm-text-blue">${song.musicName}</h5>
                  <p class="mb-0">${song.singer}</p>
                 <audio controls><source src="/uploads/audio/${song.audio}" type="audio/mp3"></audio>
                </div>

              </div>
            </div>
                `;
            });
            document.querySelector(".media-boxes").innerHTML = html;

        }
        document.addEventListener("DOMContentLoaded", fetchSongs);



        