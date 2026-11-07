document.addEventListener("DOMContentLoaded", () => {
    // 1. Tangkap elemen DOM
    const btnFetch = document.querySelector("#btnFetch");
    const statusMessage = document.querySelector("#statusMessage");
    const userList = document.querySelector("#userList");

    // 2. Ambil data pengguna dari server API
    const fetchUsers = async () => {
        btnFetch.disabled = true;
        statusMessage.textContent = "Sedang memuat data dari server...";
        statusMessage.className = "status-msg";
        userList.innerHTML = "";

        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users"
            );

            if (!response.ok) {
                throw new Error(
                    `Gagal mengambil data! Status HTTP: ${response.status}`
                );
            }

            const users = await response.json();

            statusMessage.textContent =
                `Berhasil memuat ${users.length} data pengguna!`;

            renderUsers(users);
        } catch (error) {
            statusMessage.textContent =
                `Gagal memuat data: ${error.message}`;

            statusMessage.className = "status-msg error";
        } finally {
            btnFetch.disabled = false;
        }
    };

    // 3. Tampilkan kartu pengguna
    const renderUsers = (users) => {
        userList.innerHTML = "";

        users.forEach((user) => {
            const card = document.createElement("div");
            card.className = "user-card";

            card.innerHTML = `
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-company">${user.company.name}</div>
            `;

            userList.appendChild(card);
        });
    };

    // 4. Jalankan saat tombol diklik
    btnFetch.addEventListener("click", fetchUsers);
});