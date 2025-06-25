const faqData = [
  // --- UMUM ---
  {
    category: "Umum",
    question: "Apa itu AkurasiKas?",
    answer: "AkurasiKas adalah solusi terintegrasi yang membantu Anda memantau pendapatan, pengeluaran, dan stok barang secara real-time. Ini dirancang untuk efisiensi dan akurasi dalam pengelolaan bisnis Anda."
  },
  {
    category: "Umum",
    question: "Apa saja manfaat utama menggunakan AkurasiKas?",
    answer: "Manfaat utamanya meliputi <strong>efisiensi manajemen keuangan</strong>, <strong>pengawasan stok yang lebih baik</strong>, dan <strong>laporan otomatis</strong> yang memudahkan pengambilan keputusan bisnis Anda. AkurasiKas membantu Anda menghemat waktu dan mengurangi kesalahan manual."
  },
  {
    category: "Umum",
    question: "Siapa saja yang cocok menggunakan AkurasiKas?",
    answer: "AkurasiKas ideal untuk <strong>pemilik UMKM</strong>, <strong>toko retail</strong>, dan <strong>perusahaan</strong> yang membutuhkan sistem pembukuan, mulai dari yang sederhana hingga kompleks. Fleksibilitasnya cocok untuk berbagai skala bisnis."
  },
  {
    category: "Umum",
    question: "Apakah AkurasiKas dapat digunakan untuk multi-cabang?",
    answer: "Ya, AkurasiKas dirancang untuk mendukung <strong>operasi multi-cabang</strong> dan <strong>multi-user</strong> di bawah satu akun utama. Ini memudahkan Anda mengelola beberapa lokasi bisnis dari satu platform."
  },
  {
    category: "Umum",
    question: "Apakah data saya akan hilang jika saya tidak memperpanjang langganan?",
    answer: "Tidak, data Anda <strong>tetap tersimpan dengan aman</strong> di sistem kami. Anda dapat mengaksesnya kembali kapan saja setelah memperpanjang langganan Anda."
  },

  // --- PEMBAYARAN ---
  {
    category: "Pembayaran",
    question: "Metode pembayaran apa saja yang tersedia di AkurasiKas?",
    answer: "Kami menyediakan berbagai metode pembayaran, termasuk <strong>transfer bank</strong>, <strong>kartu kredit</strong>, dan <strong>e-wallet populer</strong> seperti OVO, DANA, dan GoPay, untuk kenyamanan Anda."
  },
  {
    category: "Pembayaran",
    question: "Apakah tersedia fitur perpanjangan otomatis untuk langganan?",
    answer: "Ya, Anda bisa mengaktifkan fitur <strong>perpanjangan otomatis</strong> melalui halaman profil akun Anda. Ini memastikan layanan Anda tidak terganggu."
  },
  {
    category: "Pembayaran",
    question: "Apakah saya akan menerima invoice setelah melakukan pembayaran?",
    answer: "Tentu. <strong>Invoice pembayaran akan otomatis dikirim</strong> ke alamat email Anda setiap kali pembayaran Anda berhasil dikonfirmasi."
  },
  {
    category: "Pembayaran",
    question: "Bagaimana jika pembayaran saya gagal?",
    answer: "Jika pembayaran gagal, silakan <strong>coba ulangi proses pembayaran</strong> Anda. Apabila masalah berlanjut, jangan ragu untuk <strong>menghubungi tim dukungan</strong> kami untuk bantuan lebih lanjut."
  },
  {
    category: "Pembayaran",
    question: "Apakah AkurasiKas menyediakan versi gratis?",
    answer: "Kami menawarkan <strong>versi trial gratis selama 7 hari</strong> yang memungkinkan Anda mencoba semua fitur AkurasiKas sebelum memutuskan untuk berlangganan."
  },

  // --- LAYANAN ---
  {
    category: "Layanan",
    question: "Apakah AkurasiKas menyediakan layanan onboarding?",
    answer: "Ya, kami menyediakan <strong>panduan onboarding komprehensif</strong> serta <strong>dukungan langsung</strong> dari tim kami untuk memastikan Anda dapat mulai menggunakan AkurasiKas dengan mudah dan cepat."
  },
  {
    category: "Layanan",
    question: "Apakah AkurasiKas memiliki aplikasi mobile?",
    answer: "Ya, AkurasiKas tersedia sebagai aplikasi mobile di <strong>Google Play Store</strong> dan <strong>App Store</strong>. Ini memungkinkan Anda memantau keuangan bisnis Anda kapan pun dan di mana pun."
  },
  {
    category: "Layanan",
    question: "Berapa lama waktu yang dibutuhkan untuk aktivasi akun setelah pembayaran?",
    answer: "Akun Anda akan aktif <strong>maksimal 1x24 jam</strong> setelah pembayaran terkonfirmasi. Namun, dalam banyak kasus, aktivasi biasanya jauh lebih cepat."
  },
  {
    category: "Layanan",
    question: "Bisakah AkurasiKas diintegrasikan dengan aplikasi lain?",
    answer: "Ya, AkurasiKas mendukung <strong>integrasi API</strong> dengan berbagai aplikasi lain seperti e-commerce, sistem POS (Point of Sale), dan software akuntansi. Ini memudahkan sinkronisasi data Anda."
  },
  {
    category: "Layanan",
    question: "Bagaimana cara menghubungi dukungan teknis AkurasiKas?",
    answer: "Anda dapat menghubungi tim dukungan teknis kami melalui <strong>WhatsApp</strong>, <strong>email</strong>, atau mengisi <strong>formulir kontak</strong> yang tersedia di website resmi kami. Kami siap membantu Anda."
  },
  {
    category: "Layanan",
    question: "Apakah layanan AkurasiKas bisa dikustomisasi?",
    answer: "Untuk <strong>paket Enterprise</strong>, kami menawarkan opsi untuk meminta <strong>fitur khusus</strong> yang disesuaikan dengan kebutuhan unik bisnis Anda. Ini memberikan fleksibilitas maksimal."
  }
];

// === Render FAQ Berdasarkan Kategori atau Pencarian ===
function renderFAQ(category = null, keyword = "") {
  const faqAccordion = document.getElementById("faqAccordion");
  const faqTitle = document.getElementById("faq-category-title");
  faqAccordion.innerHTML = "";

  let filteredFaqs = faqData;

  if (category) {
    filteredFaqs = filteredFaqs.filter(faq => faq.category === category);
    faqTitle.textContent = category;
  }

  if (keyword.trim() !== "") {
    const key = keyword.toLowerCase();
    filteredFaqs = faqData.filter(faq =>
      faq.question.toLowerCase().includes(key) ||
      faq.answer.toLowerCase().includes(key)
    );
    faqTitle.textContent = `Hasil pencarian untuk: "${keyword}"`;
  }

  if (filteredFaqs.length === 0) {
    faqAccordion.innerHTML = `<div class="text-center text-muted py-4">Tidak ditemukan pertanyaan yang cocok.</div>`;
    return;
  }

  filteredFaqs.forEach((faq, i) => {
    faqAccordion.innerHTML += `
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading${i}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
            ${faq.question}
          </button>
        </h2>
        <div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="heading${i}" data-bs-parent="#faqAccordion">
          <div class="accordion-body">
            ${faq.answer}
          </div>
        </div>
      </div>
    `;
  });
}

// === Event: Klik Kategori ===
document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    const category = card.querySelector("p").textContent.trim();
    document.querySelector(".search-input").value = "";
    renderFAQ(category);
  });
});

// === Event: Telusuri / Search ===
document.querySelector(".search-button").addEventListener("click", () => {
  const keyword = document.querySelector(".search-input").value;
  document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
  renderFAQ(null, keyword);
});

// === Event: Tekan Enter saat Search ===
document.querySelector(".search-input").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.querySelector(".search-button").click();
  }
});

// === Reset Otomatis jika input dikosongkan ===
document.querySelector(".search-input").addEventListener("input", e => {
  const val = e.target.value;
  if (val.trim() === "") {
    renderFAQ("Umum");
    document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
    document.querySelectorAll(".category-card").forEach(c => {
      if (c.querySelector("p").textContent.trim() === "Umum") {
        c.classList.add("active");
      }
    });
  }
});

// === Inisialisasi Pertama ===
renderFAQ("Umum");
