const express =require("express");
const router = express.Router();
const controllersProducts = require('../controllers/products');


router.get('/',controllersProducts.getProducts)
    .post('/create',controllersProducts.postCreatePorduct)
    .get('/id',controllersProducts.getOneProduct)
    .get('/search',controllersProducts.searchProduct)

module.exports= router;