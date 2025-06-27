/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `RefreshToken_token_key` ON `refreshtoken`;

-- AlterTable
ALTER TABLE `refreshtoken` MODIFY `token` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `RefreshToken_token_key` ON `RefreshToken`(`token`(255));
