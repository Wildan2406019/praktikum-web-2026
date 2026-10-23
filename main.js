let projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

// Format angka menjadi rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

// Mencegah input teks ditafsirkan sebagai HTML
const escapeHTML = (text) => {
    return String(text).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
};

// Memperbarui kartu statistik
const updateStats = () => {
    const totalProjects = projects.length;

    const totalBudget = projects.reduce(
        (total, project) => total + project.budget,
        0
    );

    const completedCount = projects.filter(
        project => project.completed
    ).length;

    document.getElementById("stat-total-projects").textContent =
        totalProjects;

    document.getElementById("stat-total-budget").textContent =
        formatRupiah(totalBudget);

    document.getElementById("stat-completed-projects").textContent =
        completedCount;
};

// Menampilkan kartu proyek
const renderProjects = (projectList) => {
    const container = document.getElementById("project-list");

    if (projectList.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                Tidak ada proyek yang ditemukan.
            </p>
        `;
        return;
    }

    container.innerHTML = projectList.map(project => {
        const badgeClass = project.completed
            ? "badge-success"
            : "badge-pending";

        const statusText = project.completed
            ? "Selesai"
            : "Dalam Pengerjaan";

        return `
            <div class="project-card">
                <div class="project-info">
                    <span class="project-category">
                        ${escapeHTML(project.category)}
                    </span>

                    <h4>${escapeHTML(project.title)}</h4>

                    <p class="project-budget">
                        ${formatRupiah(project.budget)}
                    </p>

                    <span class="badge ${badgeClass}">
                        ${statusText}
                    </span>
                </div>

                <div class="project-actions">
                    <button
                        class="btn btn-status"
                        data-action="toggle"
                        data-id="${project.id}"
                    >
                        Ubah Status
                    </button>

                    <button
                        class="btn btn-delete"
                        data-action="delete"
                        data-id="${project.id}"
                    >
                        Hapus Proyek
                    </button>
                </div>
            </div>
        `;
    }).join("");
};

// Menggabungkan pencarian dan filter kategori
const applyFilters = () => {
    const searchText = document
        .getElementById("search-input")
        .value.toLowerCase()
        .trim();

    const selectedCategory = document.querySelector(
        ".btn-filter.active"
    ).dataset.category;

    const filteredProjects = projects.filter(project => {
        const matchesName = project.title
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "Semua" ||
            project.category === selectedCategory;

        return matchesName && matchesCategory;
    });

    renderProjects(filteredProjects);
};

// Menangani semua interaksi halaman
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("project-form");
    const searchInput = document.getElementById("search-input");
    const filterButtons = document.querySelectorAll(".btn-filter");
    const projectList = document.getElementById("project-list");

    // Form tambah proyek
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document
            .getElementById("project-title")
            .value.trim();

        const category = document
            .getElementById("project-category")
            .value;

        const budget = Number(
            document.getElementById("project-budget").value
        );

        const completed = document
            .getElementById("project-completed")
            .checked;

        // Validasi judul
        if (title === "") {
            alert("Judul proyek tidak boleh kosong!");
            return;
        }

        // Validasi anggaran
        if (!Number.isFinite(budget) || budget <= 0) {
            alert("Anggaran harus lebih besar dari 0!");
            return;
        }

        // Membuat objek proyek baru dengan ID unik
        const newProject = {
            id: Date.now(),
            title: title,
            category: category,
            budget: budget,
            completed: completed
        };

        // Menambahkan proyek ke array
        projects = [...projects, newProject];

        // Reset form setelah berhasil
        form.reset();

        // Tampilkan proyek dan statistik terbaru
        updateStats();
        applyFilters();

        alert("Proyek berhasil ditambahkan!");
    });

    // Pencarian real-time
    searchInput.addEventListener("input", () => {
        applyFilters();
    });

    // Filter kategori
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            applyFilters();
        });
    });

    // Tombol ubah status dan hapus proyek
    projectList.addEventListener("click", (e) => {
        const button = e.target.closest("button[data-action]");

        if (!button) return;

        const projectId = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === "toggle") {
            // Mengubah status proyek
            projects = projects.map(project => {
                if (project.id === projectId) {
                    return {
                        ...project,
                        completed: !project.completed
                    };
                }

                return project;
            });
        }

        if (action === "delete") {
            // Menghapus proyek berdasarkan ID
            projects = projects.filter(
                project => project.id !== projectId
            );
        }

        // Memperbarui statistik dan daftar proyek
        updateStats();
        applyFilters();
    });

    // Tampilan awal
    updateStats();
    applyFilters();
});