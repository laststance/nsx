/*
  Warnings:

  - Made the column `name` on table `authors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `authors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `body` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pageTitle` on table `stocks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `stocks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `authors` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `password` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `posts` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `body` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `stocks` MODIFY `pageTitle` TEXT NOT NULL,
    MODIFY `url` TEXT NOT NULL;
