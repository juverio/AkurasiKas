import sequelize from '../database/sequelize.js';
import User from './User.js';
import ArusKas from './ArusKas.js';
import Inventori from './Inventori.js';
import Pembelian from './Pembelian.js';
import Penjualan from './Penjualan.js';
import DetailPembelian from './DetailPembelian.js';
import DetailPenjualan from './DetailPenjualan.js';
import Transaksi from './Transaksi.js';

// Relasi antar model
User.hasMany(Transaksi, { foreignKey: 'user_id' });
Transaksi.belongsTo(User, { foreignKey: 'user_id' });

Transaksi.hasOne(ArusKas, { foreignKey: 'transaksi_id' });
ArusKas.belongsTo(Transaksi, { foreignKey: 'transaksi_id' });

User.hasMany(Pembelian, { foreignKey: 'user_id' });
Pembelian.belongsTo(User, { foreignKey: 'user_id' });

Transaksi.hasOne(Pembelian, { foreignKey: 'transaksi_id' });
Pembelian.belongsTo(Transaksi, { foreignKey: 'transaksi_id' });

Pembelian.hasMany(DetailPembelian, { foreignKey: 'pembelian_id' });
DetailPembelian.belongsTo(Pembelian, { foreignKey: 'pembelian_id' });

Inventori.hasMany(DetailPembelian, { foreignKey: 'inventori_id' });
DetailPembelian.belongsTo(Inventori, { foreignKey: 'inventori_id' });

User.hasMany(Penjualan, { foreignKey: 'user_id' });
Penjualan.belongsTo(User, { foreignKey: 'user_id' });

Transaksi.hasOne(Penjualan, { foreignKey: 'transaksi_id' });
Penjualan.belongsTo(Transaksi, { foreignKey: 'transaksi_id' });

Penjualan.hasMany(DetailPenjualan, { foreignKey: 'penjualan_id' });
DetailPenjualan.belongsTo(Penjualan, { foreignKey: 'penjualan_id' });

Inventori.hasMany(DetailPenjualan, { foreignKey: 'inventori_id' });
DetailPenjualan.belongsTo(Inventori, { foreignKey: 'inventori_id' });

export default sequelize;
export {
  User,
  Transaksi,
  Pembelian,
  Penjualan,
  ArusKas, // ✅ tambahkan ini
  Inventori,
  DetailPembelian,
  DetailPenjualan,
};