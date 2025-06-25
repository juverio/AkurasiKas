import {
  Transaksi, Pembelian, Penjualan,
  User, Inventori, ArusKas, DetailPembelian, DetailPenjualan
} from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../database/sequelize.js';

const showTransactionPage = async (req, res) => {
  try {
    const { type = 'pembelian', startDate, endDate, page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // ⏰ Filter tanggal
    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // 📌 Filter jenis transaksi berdasarkan type
    if (type === 'penjualan') {
      whereClause.jenis_transaksi = 'pemasukan';
    } else {
      whereClause.jenis_transaksi = 'pengeluaran';
    }

    // 🔗 Relasi yang disertakan
    const includeOptions = [
      { model: User, attributes: ['name'] },
      { model: ArusKas },
    ];

    if (type === 'penjualan') {
      includeOptions.push({ model: Penjualan });
    } else {
      includeOptions.push({ model: Pembelian });
    }

    // 📄 Query transaksi dengan pagination
    const { rows: transaksiList, count } = await Transaksi.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      order: [['tanggal', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    // 🖥️ Render ke halaman EJS
    res.render('transaction', {
      user: req.session.user,
      transaksiList,
      selectedType: type,
      startDate,
      endDate,
      currentPage: Number(page),
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat transaksi');
  }
};


const createTransaction = async (req, res) => {
  const { jenis, nama_customer, barang = [] } = req.body;
  const user_id = req.session.user?.user_id;

  if (!user_id) return res.status(401).json({ message: 'User tidak terautentikasi.' });

  if (!jenis || !Array.isArray(barang) || barang.length === 0) {
    return res.status(400).json({ message: 'Data transaksi tidak lengkap.' });
  }

  const total = barang.reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    const harga = Number(item.harga_satuan) || 0;
    const disc = Number(item.disc) || 0;
    return sum + qty * harga * (1 - disc / 100);
  }, 0);

  const jenis_transaksi = jenis === 'penjualan' ? 'pemasukan' : 'pengeluaran';

  const t = await sequelize.transaction();
  try {
    // Transaksi
    const transaksi = await Transaksi.create({
      user_id, // ✅ integer dari session
      tanggal: new Date(),
      jenis_transaksi,
      jumlah: total,
      deskripsi: `Transaksi ${jenis} - ${new Date().toLocaleDateString('id-ID')}`,
    }, { transaction: t });

    if (jenis === 'penjualan') {
      // Penjualan
      const penjualan = await Penjualan.create({
        user_id, // ✅ integer dari session
        transaksi_id: transaksi.transaksi_id,
        nama: nama_customer, // ✅ nama customer disimpan di kolom "nama"
        tanggal_penjualan: new Date(),
        total_penjualan: total,
        status_pengiriman: 'Diproses'
      }, { transaction: t });

      for (const item of barang) {
        const inv = await Inventori.findOne({ where: { kode_barang: item.kode_barang } });
        if (!inv) throw new Error(`Barang ${item.kode_barang} tidak ditemukan`);

        if (inv.jumlah_stok < item.qty) {
          throw new Error(`Stok tidak cukup untuk barang ${item.nama_barang}`);
        }

        await DetailPenjualan.create({
          penjualan_id: penjualan.penjualan_id,
          inventori_id: inv.inventori_id,
          kode_barang: item.kode_barang,
          nama_barang: item.nama_barang,
          bagian: item.bagian,
          qty: item.qty,
          disc: item.disc,
          harga_satuan: item.harga_satuan,
          subtotal: item.qty * item.harga_satuan * (1 - item.disc / 100),
        }, { transaction: t });

        await Inventori.update(
          { jumlah_stok: inv.jumlah_stok - item.qty },
          { where: { inventori_id: inv.inventori_id }, transaction: t }
        );
      }

    } else if (jenis === 'pembelian') {
      // Pembelian
      const pembelian = await Pembelian.create({
        user_id, // ✅ integer dari session
        transaksi_id: transaksi.transaksi_id,
        nama: nama_customer, // ✅ disimpan ke kolom "nama"
        tanggal_pembelian: new Date(),
        total_biaya: total,
        status_pengiriman: 'diproses'
      }, { transaction: t });

      for (const item of barang) {
        const inv = await Inventori.findOne({ where: { kode_barang: item.kode_barang } });
        if (!inv) throw new Error(`Barang ${item.kode_barang} tidak ditemukan`);

        await DetailPembelian.create({
          pembelian_id: pembelian.pembelian_id,
          inventori_id: inv.inventori_id,
          kode_barang: item.kode_barang,
          nama_barang: item.nama_barang,
          bagian: item.bagian,
          qty: item.qty,
          disc: item.disc,
          harga_satuan: item.harga_satuan,
          subtotal: item.qty * item.harga_satuan * (1 - item.disc / 100),
        }, { transaction: t });

        await Inventori.update(
          { jumlah_stok: inv.jumlah_stok + item.qty },
          { where: { inventori_id: inv.inventori_id }, transaction: t }
        );
      }
    }

    await t.commit();
    res.status(201).json({ message: 'Transaksi berhasil disimpan' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: error.message || 'Gagal menyimpan transaksi' });
  }
};

const updateStatusPengiriman = async (req, res) => {
  try {
    const { id } = req.params; // ID dari penjualan/pembelian
    const { status, jenis } = req.body; // jenis = 'penjualan' / 'pembelian'

    if (jenis === 'penjualan') {
      const updated = await Penjualan.update(
        { status_pengiriman: status },
        { where: { penjualan_id: id } }
      );
      if (updated[0] === 0) return res.status(404).json({ message: 'Penjualan tidak ditemukan' });

    } else if (jenis === 'pembelian') {
      const updated = await Pembelian.update(
        { status_pengiriman: status },
        { where: { pembelian_id: id } }
      );
      if (updated[0] === 0) return res.status(404).json({ message: 'Pembelian tidak ditemukan' });
    }

    res.json({ message: 'Status pengiriman berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui status pengiriman' });
  }
};

const deleteTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { jenis } = req.body; // jenis = 'penjualan' / 'pembelian'

    if (jenis === 'penjualan') {
      await DetailPenjualan.destroy({ where: { penjualan_id: id }, transaction: t });
      const deleted = await Penjualan.destroy({ where: { penjualan_id: id }, transaction: t });
      if (!deleted) return res.status(404).json({ message: 'Penjualan tidak ditemukan' });

    } else if (jenis === 'pembelian') {
      await DetailPembelian.destroy({ where: { pembelian_id: id }, transaction: t });
      const deleted = await Pembelian.destroy({ where: { pembelian_id: id }, transaction: t });
      if (!deleted) return res.status(404).json({ message: 'Pembelian tidak ditemukan' });
    }

    await t.commit();
    res.json({ message: 'Transaksi berhasil dihapus' });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus transaksi' });
  }
};

const getTransactionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { jenis } = req.query;

    let transaksi = null;

    if (jenis === 'penjualan') {
      transaksi = await Penjualan.findByPk(id, {
        include: [DetailPenjualan]
      });
    } else if (jenis === 'pembelian') {
      transaksi = await Pembelian.findByPk(id, {
        include: [DetailPembelian]
      });
    }

    if (!transaksi) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    res.json(transaksi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil detail transaksi' });
  }
};

const updateTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { barang = [], jenis } = req.body;

    let totalBaru = 0;

    if (jenis === 'penjualan') {
      await DetailPenjualan.destroy({ where: { penjualan_id: id }, transaction: t });

      for (const item of barang) {
        const subtotal = item.qty * item.harga_satuan * (1 - item.disc / 100);
        totalBaru += subtotal;

        await DetailPenjualan.create({
          penjualan_id: id,
          inventori_id: item.inventori_id,
          kode_barang: item.kode_barang,
          nama_barang: item.nama_barang,
          bagian: item.bagian,
          qty: item.qty,
          disc: item.disc,
          harga_satuan: item.harga_satuan,
          subtotal
        }, { transaction: t });
      }

      await Penjualan.update(
        { total_penjualan: totalBaru },
        { where: { penjualan_id: id }, transaction: t }
      );

    } else if (jenis === 'pembelian') {
      await DetailPembelian.destroy({ where: { pembelian_id: id }, transaction: t });

      for (const item of barang) {
        const subtotal = item.qty * item.harga_satuan * (1 - item.disc / 100);
        totalBaru += subtotal;

        await DetailPembelian.create({
          pembelian_id: id,
          inventori_id: item.inventori_id,
          kode_barang: item.kode_barang,
          nama_barang: item.nama_barang,
          bagian: item.bagian,
          qty: item.qty,
          disc: item.disc,
          harga_satuan: item.harga_satuan,
          subtotal
        }, { transaction: t });
      }

      await Pembelian.update(
        { total_biaya: totalBaru },
        { where: { pembelian_id: id }, transaction: t }
      );
    }

    await t.commit();
    res.json({ message: 'Transaksi berhasil diperbarui' });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui transaksi' });
  }
};

const cariBarangByKode = async (req, res) => {
  try {
    const { kode } = req.query;
    const barang = await Inventori.findOne({ where: { kode_barang: kode } });

    if (!barang) return res.status(404).json({ message: 'Barang tidak ditemukan' });

    res.json({
      inventori_id: barang.inventori_id,
      kode_barang: barang.kode_barang,
      nama_barang: barang.nama_barang,
      bagian: barang.bagian
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mencari barang', error });
  }
};

export default { 
  showTransactionPage, 
  createTransaction, 
  cariBarangByKode, 
  updateStatusPengiriman, 
  deleteTransaction,
  getTransactionDetail,
  updateTransaction };