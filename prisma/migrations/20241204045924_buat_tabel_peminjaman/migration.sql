-- CreateTable
CREATE TABLE `peminjaman` (
    `pinjamID` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `itemID` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `borrow_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NOT NULL,
    `status` ENUM('dipinjam', 'kembali') NOT NULL DEFAULT 'dipinjam',

    PRIMARY KEY (`pinjamID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
