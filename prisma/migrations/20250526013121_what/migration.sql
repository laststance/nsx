-- DropForeignKey
ALTER TABLE `attachment` DROP FOREIGN KEY `attachment_tweetId_fkey`;

-- DropIndex
DROP INDEX `attachment_tweetId_fkey` ON `attachment`;

-- AddForeignKey
ALTER TABLE `attachment` ADD CONSTRAINT `attachment_tweetId_fkey` FOREIGN KEY (`tweetId`) REFERENCES `tweet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
