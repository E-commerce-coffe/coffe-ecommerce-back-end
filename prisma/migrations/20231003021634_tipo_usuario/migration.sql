/*
  Warnings:

  - Added the required column `TIPO_USUARIO` to the `personas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `personas` ADD COLUMN `TIPO_USUARIO` CHAR(1) NOT NULL;
