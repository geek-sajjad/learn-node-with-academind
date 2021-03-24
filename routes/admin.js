const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, adminController.postAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.get('/edit-product/:productId', isAuth, adminController.getEdiProduct);
router.post('/edit-product', isAuth, adminController.postEdiProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
module.exports = router;