/*
  Warnings:

  - The primary key for the `credenciales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contrasena` on the `credenciales` table. All the data in the column will be lost.
  - You are about to drop the column `usuario` on the `credenciales` table. All the data in the column will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[NOMBRE_USUARIO]` on the table `credenciales` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CONTRASENA_USUARIO` to the `credenciales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID_CREDENCIAL` to the `credenciales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NOMBRE_USUARIO` to the `credenciales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `credenciales` DROP FOREIGN KEY `credenciales_ibfk_1`;

-- AlterTable
ALTER TABLE `credenciales` DROP PRIMARY KEY,
    DROP COLUMN `contrasena`,
    DROP COLUMN `usuario`,
    ADD COLUMN `CONTRASENA_USUARIO` CHAR(60) NOT NULL,
    ADD COLUMN `ID_CREDENCIAL` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `NOMBRE_USUARIO` CHAR(40) NOT NULL,
    ADD PRIMARY KEY (`ID_CREDENCIAL`);

-- DropTable
DROP TABLE `usuarios`;

-- CreateTable
CREATE TABLE `detalle_factura` (
    `ID_LOTE` INTEGER NOT NULL,
    `ID_FACTURA` INTEGER NOT NULL,
    `UNIDADES_PRODUCTO` INTEGER NOT NULL,
    `SUB_TOTAL_PRECIO` FLOAT NOT NULL,

    INDEX `FK_RELATION_RELATIONS_FACTURA`(`ID_FACTURA`),
    PRIMARY KEY (`ID_LOTE`, `ID_FACTURA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factura` (
    `ID_FACTURA` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_PERSONA` INTEGER NOT NULL,
    `VALOR_TOTAL` FLOAT NOT NULL,
    `FECHA_FACTURA` DATETIME(0) NOT NULL,

    INDEX `FK_FACTURA_FACTURA_F_PERSONAS`(`ID_PERSONA`),
    PRIMARY KEY (`ID_FACTURA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lote` (
    `ID_LOTE` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_PRODUCTO` INTEGER NOT NULL,
    `VALOR_LOTE_PRODUCTO` FLOAT NOT NULL,
    `STOCK` INTEGER NOT NULL,

    INDEX `FK_LOTE_RELATIONS_PRODUCTO`(`ID_PRODUCTO`),
    PRIMARY KEY (`ID_LOTE`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personas` (
    `ID_PERSONA` INTEGER NOT NULL AUTO_INCREMENT,
    `NOMBRE_USUARIO` CHAR(30) NOT NULL,
    `APELLIDO_USUARIO` CHAR(30) NOT NULL,
    `DOCUMETO_USUAR` INTEGER NOT NULL,
    `CORREO_USUARIO` CHAR(40) NOT NULL,

    UNIQUE INDEX `personas_CORREO_USUARIO_key`(`CORREO_USUARIO`),
    PRIMARY KEY (`ID_PERSONA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `ID_PRODUCTO` INTEGER NOT NULL AUTO_INCREMENT,
    `NOMBRE_PRODUCTO` CHAR(30) NOT NULL,
    `DESCRIPCION` CHAR(90) NOT NULL,
    `CATEGORIA` CHAR(20) NOT NULL,
    `PATH_IMAGEN` CHAR(200) NULL,
    `ESTADO` CHAR(1) NOT NULL,

    PRIMARY KEY (`ID_PRODUCTO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ventas` (
    `ID_VENTA` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_PERSONA` INTEGER NOT NULL,
    `FECHA_VENTA` DATETIME(0) NOT NULL,
    `VALOR_VENTA` FLOAT NOT NULL,
    `ESTADO_VENTA` CHAR(1) NOT NULL,
    `COMPROBANTE_PAGO` CHAR(200) NOT NULL,

    INDEX `FK_VENTAS_VENTAS_FK_PERSONAS`(`ID_PERSONA`),
    PRIMARY KEY (`ID_VENTA`, `ID_PERSONA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ventas_productos` (
    `ID_PRODUCTO` INTEGER NOT NULL,
    `ID_VENTA` INTEGER NOT NULL,
    `ID_PERSONA` INTEGER NOT NULL,
    `PRECIO_PRODUCTO_VENTA` INTEGER NOT NULL,
    `CANTIDAD_PRODUCTO` INTEGER NOT NULL,

    INDEX `FK_VENTAS_P_VENTAPRO__VENTAS`(`ID_VENTA`, `ID_PERSONA`),
    PRIMARY KEY (`ID_PRODUCTO`, `ID_VENTA`, `ID_PERSONA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `credenciales_NOMBRE_USUARIO_key` ON `credenciales`(`NOMBRE_USUARIO`);

-- AddForeignKey
ALTER TABLE `detalle_factura` ADD CONSTRAINT `FK_RELATION_RELATIONS_FACTURA` FOREIGN KEY (`ID_FACTURA`) REFERENCES `factura`(`ID_FACTURA`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `detalle_factura` ADD CONSTRAINT `FK_RELATION_RELATIONS_LOTE` FOREIGN KEY (`ID_LOTE`) REFERENCES `lote`(`ID_LOTE`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `factura` ADD CONSTRAINT `FK_FACTURA_FACTURA_F_PERSONAS` FOREIGN KEY (`ID_PERSONA`) REFERENCES `personas`(`ID_PERSONA`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `lote` ADD CONSTRAINT `FK_LOTE_RELATIONS_PRODUCTO` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `productos`(`ID_PRODUCTO`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `credenciales` ADD CONSTRAINT `credenciales_ibfk_1` FOREIGN KEY (`NOMBRE_USUARIO`) REFERENCES `personas`(`CORREO_USUARIO`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ventas` ADD CONSTRAINT `FK_VENTAS_VENTAS_FK_PERSONAS` FOREIGN KEY (`ID_PERSONA`) REFERENCES `personas`(`ID_PERSONA`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ventas_productos` ADD CONSTRAINT `FK_VENTAS_P_VENTAPRO__VENTAS` FOREIGN KEY (`ID_VENTA`, `ID_PERSONA`) REFERENCES `ventas`(`ID_VENTA`, `ID_PERSONA`) ON DELETE RESTRICT ON UPDATE RESTRICT;
