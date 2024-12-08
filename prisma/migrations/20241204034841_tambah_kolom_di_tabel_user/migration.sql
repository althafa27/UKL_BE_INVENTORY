-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('admin', 'member') NOT NULL DEFAULT 'member';
