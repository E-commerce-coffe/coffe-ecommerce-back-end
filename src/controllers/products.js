const { PrismaClient } = require('@prisma/client')
const { get } = require('../routers/routerUsuarios')
const prisma = new PrismaClient()


const getProducst = async (req, res) => {
    try {
        const allUsers = await prisma.productos.findMany()
        res.json(allUsers);
    } catch (error) {
        res.status(500);
        res.send('Personas no econtrados/error');
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
        
        return res.status(200).json(producto); // Enviar la respuesta al cliente
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al crear el producto');
    }
};


module.exports = {
    getProducst,
    postCreatePorduct
}