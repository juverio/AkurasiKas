import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Transaksi
const Transaksi = sequelize.define('Transaksi', {
  transaksi_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  tanggal: { type: DataTypes.DATE, allowNull: false },
  jenis_transaksi: { type: DataTypes.ENUM('pemasukan', 'pengeluaran'), allowNull: false },
  jumlah: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  deskripsi: { type: DataTypes.TEXT }
}, { tableName: 'Transaksi', timestamps: false });

export default Transaksi;