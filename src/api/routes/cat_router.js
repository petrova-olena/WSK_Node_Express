import express from 'express';
import multer from 'multer';
import {createThumbnail} from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';

import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat_controller.js';

const catRouter = express.Router();
const upload = multer({dest: 'uploads/'});

catRouter
  .route('/')
  .get(getCat)
  .post(authenticateToken, upload.single('cat'), createThumbnail, postCat);

catRouter
  .route('/:id')
  .get(getCatById)
  .put(authenticateToken, putCat)
  .delete(authenticateToken, deleteCat);

catRouter.get('/user/:id', getCatsByUserId);

export default catRouter;
