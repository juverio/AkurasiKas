import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Detail Pembelian
const DetailPembelian = sequelize.define('DetailPembelian', {
  detailpembelian_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pembelian_id: { type: DataTypes.INTEGER, allowNull: false },
  inventori_id: { type: DataTypes.INTEGER, allowNull: false },
  kode_barang: { type: DataTypes.STRING(50) },
  nama_barang: { type: DataTypes.STRING(50) },
  bagian: { type: DataTypes.STRING(50) },
  qty: { type: DataTypes.DECIMAL(15, 2) },
  disc: { type: DataTypes.DECIMAL(15, 2) },
  harga_satuan: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false }
}, { tableName: 'Detail_Pembelian', timestamps: false });

export default DetailPembelian;