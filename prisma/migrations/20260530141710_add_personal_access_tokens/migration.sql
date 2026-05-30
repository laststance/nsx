-- CreateTable
CREATE TABLE `personal_access_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tokenHash` CHAR(64) NOT NULL,
    `tokenSuffix` CHAR(4) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `lastUsedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `personal_access_tokens_tokenHash_key`(`tokenHash`),
    INDEX `personal_access_tokens_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `personal_access_tokens` ADD CONSTRAINT `personal_access_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `authors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
