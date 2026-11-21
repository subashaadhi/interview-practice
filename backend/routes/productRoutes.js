import express from 'express';
import { createProduct, getProducts, getSingleProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/', protect)
    .get(getProducts)
    .post(createProduct)

router.route('/:id',protect)
    .get(getSingleProduct)
    .delete(deleteProduct)

export default router