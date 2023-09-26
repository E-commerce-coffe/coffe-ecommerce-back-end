/*
  Warnings:

  - Added the required column `rol` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `rol` VARCHAR(1) NOT NULL;
