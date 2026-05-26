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
ALTER TABLE `authors` ADD COLUMN `sessionVersion` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `authorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `stocks` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `tweet` ADD COLUMN `userId` INTEGER NULL;

-- Backfill existing personal content to the first account before enforcing ownership.
SET @fallback_author_id = (SELECT `id` FROM `authors` ORDER BY `id` ASC LIMIT 1);
SET @owned_content_count = (
    (SELECT COUNT(*) FROM `posts`) +
    (SELECT COUNT(*) FROM `stocks`) +
    (SELECT COUNT(*) FROM `tweet`)
);

-- Abort explicitly if legacy owned content exists but no author can own it.
CREATE TEMPORARY TABLE `_nsx_author_backfill_guard` (`id` INTEGER NOT NULL);
INSERT INTO `_nsx_author_backfill_guard` (`id`)
SELECT CASE
    WHEN @fallback_author_id IS NULL AND @owned_content_count > 0 THEN NULL
    ELSE 0
END;
DROP TEMPORARY TABLE `_nsx_author_backfill_guard`;

UPDATE `posts`
SET `authorId` = @fallback_author_id
WHERE `authorId` IS NULL;

UPDATE `stocks`
SET `userId` = @fallback_author_id
WHERE `userId` IS NULL;

UPDATE `tweet`
SET `userId` = @fallback_author_id
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
