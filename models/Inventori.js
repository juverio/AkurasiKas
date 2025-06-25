import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Inventori
const Inventori = sequelize.define('Inventori', {
  inventori_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  kode_barang: { type: DataTypes.STRING(50), allowNull: false },
  nama_barang: { type: DataTypes.STRING(50), allowNull: false },
  bagian: { type: DataTypes.STRING(50) },
  jumlah_stok: { type: DataTypes.INTEGER, validate: { min: 0} },
  tanggal_pembelian: { type: DataTypes.DATEONLY }
}, { tableName: 'Inventori', timestamps: false });

export default Inventori;