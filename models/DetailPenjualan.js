import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Detail Penjualan
const DetailPenjualan = sequelize.define('DetailPenjualan', {
  detail_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  penjualan_id: { type: DataTypes.INTEGER, allowNull: false },
  inventori_id: { type: DataTypes.INTEGER, allowNull: false },
  kode_barang: { type: DataTypes.STRING(50) },
  nama_barang: { type: DataTypes.STRING(50) },
  bagian: { type: DataTypes.STRING(50) },
  qty: { type: DataTypes.DECIMAL(15, 2) },
  disc: { type: DataTypes.DECIMAL(15, 2) },
  harga_satuan: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false }
}, { tableName: 'Detail_Penjualan', timestamps: false });

export default DetailPenjualan;