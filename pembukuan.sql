CREATE DATABASE sistem_pembukuan;
USE sistem_pembukuan;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pemilik') NOT NULL,
    photo VARCHAR(255) DEFAULT NULL
);

DROP TABLE IF exists Users;
DROP TABLE IF EXISTS Transaksi;
DROP TABLE IF EXISTS Arus_Kas;
DROP TABLE IF EXISTS Pembelian;
DROP TABLE IF EXISTS Penjualan;
DROP TABLE IF EXISTS Detail_Pembelian;
DROP TABLE IF EXISTS Detail_Penjualan;

CREATE TABLE Transaksi (
  transaksi_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tanggal DATETIME NOT NULL,
  jenis_transaksi ENUM('pemasukan', 'pengeluaran') NOT NULL,
  jumlah DECIMAL(15,2) NOT NULL,
  deskripsi TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Arus_Kas (
  cashflow_id INT AUTO_INCREMENT PRIMARY KEY,
  transaksi_id INT NOT NULL UNIQUE,
  pemasukan DECIMAL(15,2) DEFAULT 0,
  pengeluaran DECIMAL(15,2) DEFAULT 0,
  saldo DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (transaksi_id) REFERENCES Transaksi(transaksi_id) ON DELETE CASCADE
);

CREATE TABLE Inventori (
  inventori_id INT AUTO_INCREMENT PRIMARY KEY,
  kode_barang VARCHAR(50) NOT NULL,
  nama_barang VARCHAR(50) NOT NULL,
  bagian VARCHAR(50),
  jumlah_stok INT,
  tanggal_pembelian DATETIME
);

CREATE TABLE Pembelian (
  pembelian_id INT AUTO_INCREMENT PRIMARY KEY,
  transaksi_id INT NOT NULL,
  user_id INT NOT NULL,
  nama VARCHAR(150),
  tanggal_pembelian DATETIME NOT NULL,
  total_biaya DECIMAL(15,2) NOT NULL,
  status_pengiriman VARCHAR(50),
  FOREIGN KEY (transaksi_id) REFERENCES Transaksi(transaksi_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Penjualan (
  penjualan_id INT AUTO_INCREMENT PRIMARY KEY,
  transaksi_id INT NOT NULL,
  user_id INT NOT NULL,
  nama VARCHAR(150),
  tanggal_penjualan DATETIME NOT NULL,
  total_penjualan DECIMAL(15,2) NOT NULL,
  status_pengiriman VARCHAR(50),
  FOREIGN KEY (transaksi_id) REFERENCES Transaksi(transaksi_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Detail_Pembelian (
  detailpembelian_id INT AUTO_INCREMENT PRIMARY KEY,
  pembelian_id INT NOT NULL,
  inventori_id INT NOT NULL,
  kode_barang VARCHAR(50),
  nama_barang VARCHAR(50),
  bagian VARCHAR(50),
  qty DECIMAL(15,2),
  disc DECIMAL(15,2),
  harga_satuan DECIMAL(15,2),
  subtotal DECIMAL(15,2),
  FOREIGN KEY (pembelian_id) REFERENCES Pembelian(pembelian_id) ON DELETE CASCADE,
  FOREIGN KEY (inventori_id) REFERENCES Inventori(inventori_id) ON DELETE CASCADE
);

CREATE TABLE Detail_Penjualan (
  detail_id INT AUTO_INCREMENT PRIMARY KEY,
  penjualan_id INT NOT NULL,
  inventori_id INT NOT NULL,
  kode_barang VARCHAR(50),
  nama_barang VARCHAR(50),
  bagian VARCHAR(50),
  qty DECIMAL(15,2),
  disc DECIMAL(15,2),
  harga_satuan DECIMAL(15,2),
  subtotal DECIMAL(15,2),
  FOREIGN KEY (penjualan_id) REFERENCES Penjualan(penjualan_id) ON DELETE CASCADE,
  FOREIGN KEY (inventori_id) REFERENCES Inventori(inventori_id) ON DELETE CASCADE
);

SELECT * from Users;
SELECT * from Inventori;
SELECT * from Pembelian;
SELECT * from Penjualan;
SELECT * from Detail_Penjualan;
SELECT * from Detail_Pembelian;