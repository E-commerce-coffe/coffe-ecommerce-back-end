const { PrismaClient } = require('@prisma/client')
const { get, search } = require('../routers/routerUsuarios')
const prisma = new PrismaClient()


const searchProduct = async (req, res) => {
    try {
        const { search } = req.query; // Nota: se cambió a req.query para obtener parámetros de la URL
        const allProducts = await prisma.productos.findMany({
            include: {
                lote: {
                    select: {
                        valor_lote_producto: true
                    }
                }
            }
        });

        let filteredProducts;
        if (search && search.trim() !== '') {
            filteredProducts = allProducts.filter(product =>
                product.nombre_producto.toLowerCase().includes(search.toLowerCase())
            );
        } else {
            filteredProducts = allProducts;
        }

        const productLoteValues = filteredProducts.map((product) => {
            const valorLote = product.lote[0] ? product.lote[0].valor_lote_producto : null;
            return {
                id: product.id_producto,
                nombre_producto: product.nombre_producto,
                descripcion: product.descripcion,
                pathimag:product.path_imagen,
                valorLote: valorLote
            };
        });

        res.json(productLoteValues);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
};


const getProducts = async (req, res) => {
    try {
        const { search } = req.query; // Nota: se cambió a req.query para obtener parámetros de la URL
        const allProducts = await prisma.productos.findMany({
            include: {
                lote: {
                    select: {
                        valor_lote_producto: true
                    }
                }
            }
        });

        let filteredProducts;
        if (search) {
            filteredProducts = allProducts.filter(product =>
                product.nombre_producto.toLowerCase().includes(search.toLowerCase())
            );
        } else {
            filteredProducts = allProducts;
        }

        const productLoteValues = filteredProducts.map((product) => {
            const valorLote = product.lote[0] ? product.lote[0].valor_lote_producto : null;
            return {
                id: product.id_producto,
                nombre_producto: product.nombre_producto,
                descripcion: product.descripcion,
                pathimag:product.path_imagen,
                valorLote: valorLote
            };
        });

        res.json(productLoteValues);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
};
const getOneProduct = async (req, res) => {
    const id = parseInt(req.query.id);
    console.log(id); // Asume que el ID del producto se pasa como parámetro en la solicitud

    try {
        const producto = await prisma.productos.findUnique({
            where: {
                id_producto: id
            },
            include: {
                lote: {
                    select: {
                        valor_lote_producto: true,
                        stock: true
                    }
                }
            }
        });

        if (producto) {
            const valorLote = producto.lote[0] ? producto.lote[0].valor_lote_producto : null;
            const stockProduct= producto.lote[0] ? producto.lote[0].stock : null;
            const productData = {
                id: producto.id_producto,
                nombre_producto: producto.nombre_producto,
                descripcion: producto.descripcion,
                pathimag: producto.path_imagen,
                valorLote: valorLote,
                stock: stockProduct
            };
            res.json(productData);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el producto');
    }
};

const n= async (req, res) => {
    try {
        console.log(req.query.id);

        if (req.params == null) {
            res.status(400).send('No hay parámetros');
            return;
        }
        const id = parseInt(req.query.id);
        console.log(id);

        if (isNaN(id)) {
            res.status(400).send('El parámetro "id" debe ser un número válido.');
            return;
        }

        const allProducts = await prisma.productos.findUnique({
            where: {
                id_producto: id,
            },
            include: {
                lote: {
                    select: {
                        valor_lote_producto: true,
                        stock: true
                    }
                }
            }
        });
       

        if (allProducts == null) {
            res.status(404).send('No se encontró el producto');
            return;
        }

        res.json(allProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el producto');
    }
}


const postCreatePorduct = async (req, res) => {
    try {
        if (req.body == null) {
            res.status(400).send('No hay parámetros en el body');
            return;
        }

        const { nombre, descripcion, categoria, pathImagen, estado, lote } = req.body;

        if (!nombre || !descripcion || !categoria || !pathImagen || !estado || !lote) {
            res.status(400).send('Los parámetros requeridos no están presentes');
            return;
        }

        console.log("entre");

        const producto = await prisma.productos.create({
            data: {
                nombre_producto: nombre,
                descripcion: descripcion,
                categoria: categoria,
                path_imagen: pathImagen,
                estado: estado,
                lote: {
                    create: {
                        valor_lote_producto: lote.valorLote,
                        stock: lote.stockLote,
                    },
                },
            },
        });
        
        return res.status(200).json(producto,); // Enviar la respuesta al cliente
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al crear el producto');
    }
};

module.exports = {
    getProducts,
    postCreatePorduct,
    getOneProduct,
    searchProduct
}