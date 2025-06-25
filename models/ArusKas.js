import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Arus Kas
const ArusKas = sequelize.define('ArusKas', {
  cashflow_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  transaksi_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  pemasukan: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  pengeluaran: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  saldo: { type: DataTypes.DECIMAL(15, 2), allowNull: false }
}, { tableName: 'Arus_Kas', timestamps: false });

export default ArusKas;