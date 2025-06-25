import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Penjualan
const Penjualan = sequelize.define('Penjualan', {
  penjualan_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  transaksi_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  nama: { type: DataTypes.STRING(150) },
  tanggal_penjualan: { type: DataTypes.DATE, allowNull: false },
  total_penjualan: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  status_pengiriman: { type: DataTypes.STRING(50) }
}, { tableName: 'Penjualan', timestamps: false });

export default Penjualan;