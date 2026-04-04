import express from 'express';
import {body} from 'express-validator';
import {createThumbnail, upload} from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error_handlers.js';

import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat_controller.js';

const catRouter = express.Router();

// -------------------
// ROUTE: /api/v1/cats
// -------------------
catRouter
  .route('/')
  .get(getCat)
  .post(
    authenticateToken,
    upload.single('cat'), // file upload
    createThumbnail, // optional thumbnail creation
    // validation rules
    body('cat_name').trim().isLength({min: 3, max: 50}),
    body('weight').isNumeric(),
    body('owner').isInt(),
    body('birthdate').isISO8601(),
    validationErrors, // handle validation errors
    postCat
  );

// -----------------------
// ROUTE: /api/v1/cats/:id
// -----------------------
catRouter
  .route('/:id')
  .get(getCatById)
  .put(
    authenticateToken,
    // optional validation for updates
    body('cat_name').optional().trim().isLength({min: 3, max: 50}),
    body('weight').optional().isNumeric(),
    body('birthdate').optional().isISO8601(),
    validationErrors,
    putCat
  )
  .delete(authenticateToken, deleteCat);

// ----------------------------
// ROUTE: /api/v1/cats/user/:id
// ----------------------------
catRouter.get('/user/:id', getCatsByUserId);

export default catRouter;
