-- CreateTable
CREATE TABLE `usuarios` (
    `nombre_usuario` VARCHAR(30) NOT NULL,
    `correo_electronico` VARCHAR(45) NOT NULL,
    `estado` TINYINT NOT NULL,

    PRIMARY KEY (`correo_electronico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credenciales` (
    `usuario` VARCHAR(45) NOT NULL,
    `contrasena` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `credenciales` ADD CONSTRAINT `credenciales_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuarios`(`correo_electronico`) ON DELETE CASCADE ON UPDATE CASCADE;
