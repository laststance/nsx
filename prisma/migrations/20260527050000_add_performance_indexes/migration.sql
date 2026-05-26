-- Abort explicitly if duplicate author names would violate the unique login index.
SET @duplicate_author_name_count = (
    SELECT COUNT(*)
    FROM (
        SELECT `name`
        FROM `authors`
        GROUP BY `name`
        HAVING COUNT(*) > 1
    ) AS `_duplicate_author_names`
);

CREATE TEMPORARY TABLE `_nsx_author_name_unique_guard` (`id` INTEGER NOT NULL);
INSERT INTO `_nsx_author_name_unique_guard` (`id`)
SELECT CASE
    WHEN @duplicate_author_name_count > 0 THEN NULL
    ELSE 0
END;
DROP TEMPORARY TABLE `_nsx_author_name_unique_guard`;

-- User lookup and admin-list ordering indexes.
CREATE UNIQUE INDEX `authors_name_key` ON `authors`(`name`);
CREATE INDEX `authors_createdAt_id_idx` ON `authors`(`createdAt`, `id`);
CREATE INDEX `authors_updatedAt_idx` ON `authors`(`updatedAt`);

-- Post list and search-adjacent ordering indexes.
CREATE INDEX `posts_createdAt_id_idx` ON `posts`(`createdAt`, `id`);
CREATE INDEX `posts_title_idx` ON `posts`(`title`);
CREATE INDEX `posts_updatedAt_idx` ON `posts`(`updatedAt`);

-- Stock ownership, duplicate URL lookup, and maintenance ordering indexes.
CREATE INDEX `stocks_userId_createdAt_id_idx` ON `stocks`(`userId`, `createdAt`, `id`);
CREATE INDEX `stocks_userId_url_idx` ON `stocks`(`userId`, `url`(191));
CREATE INDEX `stocks_updatedAt_idx` ON `stocks`(`updatedAt`);

-- Tweet ownership pagination and relation lookup indexes.
CREATE INDEX `tweet_userId_createdAt_id_idx` ON `tweet`(`userId`, `createdAt`, `id`);
CREATE INDEX `tweet_updatedAt_idx` ON `tweet`(`updatedAt`);
CREATE INDEX `attachment_tweetId_idx` ON `attachment`(`tweetId`);
