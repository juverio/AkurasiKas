CREATE DATABASE sistem_pembukuan;
USE sistem_pembukuan;

CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'kasir', 'pemilik') NOT NULL
);

CREATE TABLE Transaksi (
    transaksi_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tanggal DATETIME NOT NULL,
    jenis ENUM('pemasukan', 'pengeluaran') NOT NULL,
    jumlah DECIMAL(15,2) NOT NULL,
    deskripsi TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
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
    nama_barang VARCHAR(100) NOT NULL,
    kategori VARCHAR(50),
    stok INT NOT NULL DEFAULT 0,
    harga_beli DECIMAL(15,2) NOT NULL,
    harga_jual DECIMAL(15,2) NOT NULL
);

CREATE TABLE Pembelian (
    pembelian_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    user_id INT NOT NULL,
    tanggal_pembelian DATETIME NOT NULL,
    total_biaya DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Penjualan (
    penjualan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tanggal_penjualan DATETIME NOT NULL,
    total_penjualan DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Detail_Penjualan (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    penjualan_id INT NOT NULL,
    inventori_id INT NOT NULL,
    jumlah INT NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (penjualan_id) REFERENCES Penjualan(penjualan_id) ON DELETE CASCADE,
    FOREIGN KEY (inventori_id) REFERENCES Inventori(inventori_id) ON DELETE CASCADE
);

CREATE TABLE Laporan_Keuangan (
    laporan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    periode VARCHAR(50) NOT NULL,
    total_pemasukan DECIMAL(15,2) DEFAULT 0,
    total_pengeluaran DECIMAL(15,2) DEFAULT 0,
    keuntungan_bersih DECIMAL(15,2) GENERATED ALWAYS AS (total_pemasukan - total_pengeluaran) STORED,
    FOREIGN KEY (user_id) REFERENCES User(user_id) on delete cascade
);