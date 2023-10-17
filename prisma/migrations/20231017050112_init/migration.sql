-- CreateTable
CREATE TABLE `detalle_factura` (
    `id_lote` INTEGER NOT NULL,
    `id_factura` INTEGER NOT NULL,
    `unidades_producto` INTEGER NOT NULL,
    `sub_total_precio` FLOAT NOT NULL,

    INDEX `fk_relation_relations_factura`(`id_factura`),
    PRIMARY KEY (`id_lote`, `id_factura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factura` (
    `id_factura` INTEGER NOT NULL AUTO_INCREMENT,
    `id_persona` INTEGER NOT NULL,
    `valor_total` FLOAT NOT NULL,
    `fecha_factura` DATETIME(0) NOT NULL,

    INDEX `fk_factura_factura_f_personas`(`id_persona`),
    PRIMARY KEY (`id_factura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lote` (
    `id_lote` INTEGER NOT NULL AUTO_INCREMENT,
    `id_producto` INTEGER NOT NULL,
    `valor_lote_producto` FLOAT NOT NULL,
    `stock` INTEGER NOT NULL,

    INDEX `fk_lote_relations_producto`(`id_producto`),
    PRIMARY KEY (`id_lote`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personas` (
    `id_persona` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_usuario` CHAR(30) NOT NULL,
    `apellido_usuario` CHAR(30) NOT NULL,
    `documento_usuario` INTEGER NOT NULL,
    `tipo_documento` CHAR(2) NOT NULL,
    `correo_usuario` CHAR(40) NOT NULL,
    `tipo_usuario` CHAR(1) NOT NULL,
    `token_password` CHAR(200) NULL,

    UNIQUE INDEX `personas_correo_usuario_key`(`correo_usuario`),
    PRIMARY KEY (`id_persona`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credenciales` (
    `id_credencial` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_usuario` CHAR(40) NOT NULL,
    `contrasena_usuario` CHAR(60) NOT NULL,

    UNIQUE INDEX `credenciales_nombre_usuario_key`(`nombre_usuario`),
    PRIMARY KEY (`id_credencial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `id_producto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_producto` CHAR(30) NOT NULL,
    `descripcion` CHAR(90) NOT NULL,
    `categoria` CHAR(20) NOT NULL,
    `path_imagen` CHAR(200) NULL,
    `estado` CHAR(1) NOT NULL,

    INDEX `fk_lote_relations_producto`(`id_producto`),
    PRIMARY KEY (`id_producto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ventas` (
    `id_venta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_persona` INTEGER NOT NULL,
    `fecha_venta` DATETIME(0) NOT NULL,
    `valor_venta` FLOAT NOT NULL,
    `estado_venta` CHAR(1) NOT NULL,
    `comprobante_pago` CHAR(200) NOT NULL,

    INDEX `fk_ventas_ventas_fk_personas`(`id_persona`),
    PRIMARY KEY (`id_venta`, `id_persona`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ventas_productos` (
    `id_producto` INTEGER NOT NULL,
    `id_venta` INTEGER NOT NULL,
    `id_persona` INTEGER NOT NULL,
    `precio_producto_venta` INTEGER NOT NULL,
    `cantidad_producto` INTEGER NOT NULL,

    INDEX `fk_ventas_p_ventapro__ventas`(`id_venta`, `id_persona`),
    PRIMARY KEY (`id_producto`, `id_venta`, `id_persona`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detalle_factura` ADD CONSTRAINT `fk_relation_relations_factura` FOREIGN KEY (`id_factura`) REFERENCES `factura`(`id_factura`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `detalle_factura` ADD CONSTRAINT `fk_relation_relations_lote` FOREIGN KEY (`id_lote`) REFERENCES `lote`(`id_lote`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `factura` ADD CONSTRAINT `fk_factura_factura_f_personas` FOREIGN KEY (`id_persona`) REFERENCES `personas`(`id_persona`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `lote` ADD CONSTRAINT `fk_lote_relations_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credenciales` ADD CONSTRAINT `credenciales_ibfk_1` FOREIGN KEY (`nombre_usuario`) REFERENCES `personas`(`correo_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ventas` ADD CONSTRAINT `fk_ventas_ventas_fk_personas` FOREIGN KEY (`id_persona`) REFERENCES `personas`(`id_persona`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ventas_productos` ADD CONSTRAINT `fk_ventas_p_ventapro__ventas` FOREIGN KEY (`id_venta`, `id_persona`) REFERENCES `ventas`(`id_venta`, `id_persona`) ON DELETE RESTRICT ON UPDATE RESTRICT;
