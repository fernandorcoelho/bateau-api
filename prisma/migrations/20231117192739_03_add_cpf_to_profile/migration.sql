/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `cpf` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `profiles_cpf_key` ON `profiles`(`cpf`);

-- CreateIndex
CREATE INDEX `profiles_cpf_idx` ON `profiles`(`cpf`);
