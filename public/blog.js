document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.querySelector(".blog-posts .row");
    const paginationEl = document.getElementById("pagination");
    const searchInput = document.querySelector(".search-input");

    const keywords = [
        "keuangan", "bisnis", "manajemen", "umkm", "usaha", "pembukuan",
        "modal", "investasi", "pengeluaran", "pendapatan", "kas", "akuntansi",
        "ekonomi", "stok", "laporan", "keuangan digital", "usaha kecil"
    ];

    const postsPerPage = 6;
    let currentPage = 1;
    let filteredBlogs = [];

    const sources = [
        "cnn-news",
        "cnbc-news",
        "detik-news",
        "okezone-news",
        "tribun-news",
        "kompas-news",
        "tempo-news",
        "antara-news",
        "republika-news",
        "sindonews",
        "jpnn-news",
        "viva-news",
        "kumparan-news",
        "merdeka-news",
        "liputan6-news",
        "suara-news",
        "okezone-news"
    ];

    function renderPaginationButtons(totalPages, current) {
        paginationEl.innerHTML = `
      <li class="page-item ${current === 1 ? "disabled" : ""}">
        <a class="page-link" href="#">Sebelumnya</a>
      </li>
      ${Array.from({ length: totalPages }, (_, i) => `
        <li class="page-item ${current === i + 1 ? "active" : ""}">
          <a class="page-link" href="#">${i + 1}</a>
        </li>
      `).join("")}
      <li class="page-item ${current === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#">Selanjutnya</a>
      </li>
    `;
    }

    function renderPage(page, query = "") {
        blogContainer.innerHTML = "";

        const matched = filteredBlogs.filter(item =>
            item.title.toLowerCase().includes(query)
        );

        const totalPages = Math.ceil(matched.length / postsPerPage);
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const pageItems = matched.slice(start, end);

        if (pageItems.length === 0) {
            blogContainer.innerHTML = "<p class='text-center'>Tidak ada artikel ditemukan.</p>";
            paginationEl.innerHTML = "";
            return;
        }

        pageItems.forEach((blog, index) => {
            const col = document.createElement("div");
            col.className = "col-md-4 mb-4";
            const sumber = blog.link.includes("cnn") ? "CNN" :
                blog.link.includes("cnbc") ? "CNBC" :
                blog.link.includes("detik") ? "Detik" :
                blog.link.includes("tribun") ? "Tribunnews" :
                blog.link.includes("okezone") ? "Okezone" :
                blog.link.includes("antara") ? "Antara" :
                blog.link.includes("republika") ? "Republika" :
                blog.link.includes("sindonews") ? "Sindo News" :
                blog.link.includes("jpnn") ? "JPNN" :
                blog.link.includes("viva") ? "Viva" :
                blog.link.includes("kumparan") ? "Kumparan" :
                blog.link.includes("merdeka") ? "Merdeka" :
                blog.link.includes("liputan6") ? "Liputan6" :
                blog.link.includes("suara") ? "Suara" :
                "Lainnya";

            // Logika untuk menampilkan gambar atau ikon
            const blogImageContent = blog.image?.large
                ? `<img src="${blog.image.large}" alt="Blog ${index + 1}" class="img-fluid">`
                : `<i class="fas fa-newspaper fa-5x text-muted" style="display: flex; justify-content: center; align-items: center; height: 100%;"></i>`; // Menggunakan ikon Font Awesome

            col.innerHTML = `
        <a href="${blog.link}" class="blog-card-link" target="_blank">
          <div class="blog-card">
            <div class="blog-image">
              ${blogImageContent}
            </div>
            <div class="blog-content">
              <h3 class="blog-title">${blog.title}</h3>
              <small class="text-muted">Sumber: ${sumber}</small>
              <div class="blog-meta">
                <span class="blog-date"><i class="far fa-calendar-alt"></i> ${new Date(blog.isoDate).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
        </a>`;
            blogContainer.appendChild(col);
        });

        renderPaginationButtons(totalPages, page);
    }

    function fetchAndRender() {
        const fetches = sources.map(source =>
            fetch(`https://berita-indo-api.vercel.app/v1/${source}?ts=${Date.now()}`)
                .then(res => {
                    if (!res.ok) throw new Error(`${source} tidak tersedia`);
                    return res.json();
                })
                .catch(err => {
                    console.warn(`Sumber gagal: ${source}`, err.message);
                    return { data: [] };
                })
        );


        Promise.all(fetches)
            .then(results => {
                const allNews = results.flatMap(source => source.data || []);
                filteredBlogs = allNews.filter(item =>
                    keywords.some(keyword =>
                        (item.title || "").toLowerCase().includes(keyword) ||
                        (item.description || "").toLowerCase().includes(keyword)
                    )
                );
                currentPage = 1;
                renderPage(currentPage);
            })
            .catch(err => {
                blogContainer.innerHTML = "<p class='text-danger text-center'>Gagal memuat berita.</p>";
                console.error(err);
            });
    }

    paginationEl.addEventListener("click", (e) => {
        if (e.target.tagName !== "A") return;
        e.preventDefault();

        const text = e.target.textContent.trim();
        const query = searchInput.value.toLowerCase();
        const totalPages = Math.ceil(filteredBlogs.filter(item =>
            item.title.toLowerCase().includes(query)).length / postsPerPage);

        if (text === "Sebelumnya" && currentPage > 1) {
            currentPage--;
        } else if (text === "Selanjutnya" && currentPage < totalPages) {
            currentPage++;
        } else if (!isNaN(parseInt(text))) {
            currentPage = parseInt(text);
        }

        renderPage(currentPage, query);
    });

    document.querySelector(".search-button").addEventListener("click", () => {
        currentPage = 1;
        renderPage(currentPage, searchInput.value.toLowerCase());
    });

    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim() === "") {
            renderPage(1);
        }
    });

    fetchAndRender();
});