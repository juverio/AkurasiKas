import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Pembelian
const Pembelian = sequelize.define('Pembelian', {
  pembelian_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  transaksi_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  nama: { type: DataTypes.STRING(150) },
  tanggal_pembelian: { type: DataTypes.DATE, allowNull: false },
  total_biaya: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  status_pengiriman: { type: DataTypes.STRING(50) }
}, { tableName: 'Pembelian', timestamps: false });

export default Pembelian;