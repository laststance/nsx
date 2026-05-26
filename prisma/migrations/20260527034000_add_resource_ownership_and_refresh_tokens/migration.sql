-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tokenHash` CHAR(64) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `refresh_tokens_tokenHash_key`(`tokenHash`),
    INDEX `refresh_tokens_userId_idx`(`userId`),
    INDEX `refresh_tokens_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `authorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `stocks` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `tweet` ADD COLUMN `userId` INTEGER NULL;

-- Backfill existing personal content to the first account before enforcing ownership.
UPDATE `posts`
SET `authorId` = (SELECT `id` FROM `authors` ORDER BY `id` ASC LIMIT 1)
WHERE `authorId` IS NULL;

UPDATE `stocks`
SET `userId` = (SELECT `id` FROM `authors` ORDER BY `id` ASC LIMIT 1)
WHERE `userId` IS NULL;

UPDATE `tweet`
SET `userId` = (SELECT `id` FROM `authors` ORDER BY `id` ASC LIMIT 1)
WHERE `userId` IS NULL;

-- AlterTable
ALTER TABLE `posts` MODIFY `authorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `stocks` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tweet` MODIFY `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `posts_authorId_idx` ON `posts`(`authorId`);

-- CreateIndex
CREATE INDEX `stocks_userId_idx` ON `stocks`(`userId`);

-- CreateIndex
CREATE INDEX `tweet_userId_idx` ON `tweet`(`userId`);

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `authors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `authors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `authors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet` ADD CONSTRAINT `tweet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `authors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
