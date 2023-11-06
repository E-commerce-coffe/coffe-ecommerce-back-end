const express =require("express");
const router = express.Router();
const controllersProducts = require('../controllers/products');


router.get('/',controllersProducts.getProducst)
    .post('/create',controllersProducts.postCreatePorduct)
    .get('/id',controllersProducts.getOneProduct)

module.exports= router;