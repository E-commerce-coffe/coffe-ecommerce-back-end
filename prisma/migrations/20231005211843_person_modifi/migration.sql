/*
  Warnings:

  - You are about to drop the column `DOCUMETO_USUAR` on the `personas` table. All the data in the column will be lost.
  - Added the required column `DOCUMENTO_USUARIO` to the `personas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TIPO_DOCUMENTO` to the `personas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `personas` DROP COLUMN `DOCUMETO_USUAR`,
    ADD COLUMN `DOCUMENTO_USUARIO` INTEGER NOT NULL,
    ADD COLUMN `TIPO_DOCUMENTO` CHAR(2) NOT NULL;
