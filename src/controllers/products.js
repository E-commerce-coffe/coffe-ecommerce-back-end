const { PrismaClient } = require('@prisma/client')
const { get } = require('../routers/routerUsuarios')
const prisma = new PrismaClient()


const getProducst = async (req, res) => {
    try {
        const allProducts = await prisma.productos.findMany({
            include: {
                lote: {
                    select: {
                        valor_lote_producto: true
                    }
                }
            }
        });

        const productLoteValues = allProducts.map((product) => {
            const valorLote = product.lote[0] ? product.lote[0].valor_lote_producto : null;
            return {
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
    getProducst,
    postCreatePorduct
}