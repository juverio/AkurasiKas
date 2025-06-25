import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Users
const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'pemilik'), allowNull: true },
  photo: { type: DataTypes.STRING(255), allowNull: true }
}, { tableName: 'Users', timestamps: false });

export default User;