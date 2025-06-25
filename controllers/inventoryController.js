import { Op } from 'sequelize';
import { Inventori } from '../models/index.js';

const showInventoryPage = async (req, res) => {
  try {
    const { startDate, endDate, search, page = 1 } = req.query;

    const limit = 10;
    const currentPage = parseInt(page) || 1;
    const offset = (currentPage - 1) * limit;

    // Filter by date if startDate and endDate are provided
    let whereClause = {};
    if (startDate && endDate) {
      whereClause.tanggal_pembelian = {
        [Op.between]: [startDate, endDate]
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { nama_barang: { [Op.like]: `%${search}%` } },
        { kode_barang: { [Op.like]: `%${search}%` } },
      ];
    }

    // Ambil data paginated dan total count
    const { count: totalItems, rows: inventories } = await Inventori.findAndCountAll({
      where: whereClause,
      order: [['tanggal_pembelian', 'DESC']],
      limit,
      offset,
    });

    // Hitung total stok baru dan lama (logika bisa disesuaikan)
    const allItems = await Inventori.findAll({ where: whereClause });
    let totalBaru = 0;
    let totalLama = 0;

    const batasTanggalLama = new Date();
    batasTanggalLama.setMonth(batasTanggalLama.getMonth() - 6); // contoh: 6 bulan ke belakang dianggap lama

    allItems.forEach(item => {
      if (item.tanggal_pembelian >= batasTanggalLama) {
        totalBaru += item.jumlah_stok || 0;
      } else {
        totalLama += item.jumlah_stok || 0;
      }
    });

    const showingFrom = offset + 1;
    const showingTo = offset + inventories.length;
    const totalPages = Math.ceil(totalItems / limit);

    res.render('inventori', {
      user: req.session.user,
      inventories,
      startDate,
      search,
      endDate,
      totalBaru,
      totalLama,
      totalItems,
      showingFrom,
      showingTo,
      currentPage,
      totalPages
    });

  } catch (error) {
    console.error('Gagal mengambil data inventori:', error);
    res.status(500).send('Terjadi kesalahan saat memuat data inventori');
  }
};

const exportInventori = async (req, res) => {
  try {
    const { kodeList } = req.body || {}; // body, bukan query string

    // Ambil data: kalau ada kodeList, pakai WHERE
    const where = kodeList?.length ? { where: { kode_barang: kodeList } } : {};
    const data = await Inventori.findAll(where);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Inventori');

    worksheet.columns = [
      { header: 'Kode Barang', key: 'kode_barang', width: 15 },
      { header: 'Nama Barang', key: 'nama_barang', width: 30 },
      { header: 'Bagian', key: 'bagian', width: 20 },
      { header: 'Tanggal Pembelian', key: 'tanggal_pembelian', width: 20 },
      { header: 'Jumlah Stok', key: 'jumlah_stok', width: 15 }
    ];

    data.forEach(item => {
      worksheet.addRow({
        kode_barang: item.kode_barang,
        nama_barang: item.nama_barang,
        bagian: item.bagian,
        tanggal_pembelian: item.tanggal_pembelian?.toISOString().slice(0, 10),
        jumlah_stok: item.jumlah_stok
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Inventori.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('❌ Gagal ekspor:', error);
    res.status(500).json({ error: 'Gagal mengekspor data' });
  }
};

const getAllInventori = async (req, res) => {
  const data = await Inventori.findAll();
  res.json(data);
};

const getDetailInventori = async (req, res) => {
  try {
    const { kode_barang } = req.params;
    console.log("🔍 Memuat detail:", kode_barang)
    const item = await Inventori.findOne({ where: { kode_barang } });

    if (!item) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    res.json(item); // ✅ Kirim data JSON ke frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createInventori = async (req, res) => {
  try {
    const { kode_barang, nama_barang, bagian, jumlah_stok, tanggal_pembelian } = req.body;

    if (!kode_barang || !nama_barang) {
      return res.status(400).json({ error: 'Kode dan nama barang wajib diisi' });
    }

    const item = await Inventori.create({ kode_barang, nama_barang, bagian, jumlah_stok, tanggal_pembelian });
    res.status(201).json(item);
  } catch (err) {
    console.error('Gagal menyimpan inventori:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateInventori = async (req, res) => {
  const { kode_barang } = req.params;
  const { nama_barang, bagian, tanggal_pembelian, jumlah_stok } = req.body;

  try {
    const item = await Inventori.findOne({ where: { kode_barang } });

    if (!item) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    await item.update({
      nama_barang,
      bagian,
      tanggal_pembelian,
      jumlah_stok
    });

    res.json({ message: 'Barang berhasil diperbarui' });
  } catch (err) {
    console.error("❌ Gagal update:", err);
    res.status(500).json({ error: 'Gagal menyimpan data' });
  }
};

const deleteInventori = async (req, res) => {
  try {
    const { kode_barang } = req.params;
    const deleted = await Inventori.destroy({ where: { kode_barang } });
    if (deleted) {
      res.json({ message: 'Barang berhasil dihapus' });
    } else {
      res.status(404).json({ error: 'Barang tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMultipleInventori = async (req, res) => {
  try {
    const { kodeList } = req.body;

    if (!Array.isArray(kodeList) || kodeList.length === 0) {
      return res.status(400).json({ error: 'Data tidak valid' });
    }

    const deleted = await Inventori.destroy({
      where: { kode_barang: kodeList }
    });

    res.json({ message: `${deleted} data berhasil dihapus` });
  } catch (err) {
    console.error('❌ Gagal hapus massal:', err);
    res.status(500).json({ error: 'Gagal menghapus data' });
  }
};

export default {
  showInventoryPage,
  exportInventori,
  getAllInventori,
  getDetailInventori,
  createInventori,
  updateInventori,
  deleteInventori, deleteMultipleInventori
};
