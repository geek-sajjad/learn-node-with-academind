const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/', productsController.index);
router.get('/products', productsController.getProducts);
router.get('/cart', productsController.cart);

module.exports = router;