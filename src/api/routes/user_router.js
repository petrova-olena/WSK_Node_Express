import express from 'express';
import {body} from 'express-validator';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user_controller.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error_handlers.js';

const userRouter = express.Router();

// /api/v1/users
userRouter
  .route('/')
  .get(getUser)
  .post(
    body('email').trim().isEmail().withMessage('email must be a valid email'),
    body('username')
      .trim()
      .isLength({min: 3, max: 20})
      .withMessage('username must be 3–20 characters')
      .isAlphanumeric()
      .withMessage('username must be alphanumeric'),
    body('password')
      .trim()
      .isLength({min: 8})
      .withMessage('password must be at least 8 characters'),
    validationErrors,
    postUser
  );

// /api/v1/users/:id
userRouter
  .route('/:id')
  .get(getUserById)
  .put(
    authenticateToken,
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('email must be a valid email'),
    body('username')
      .optional()
      .trim()
      .isLength({min: 3, max: 20})
      .withMessage('username must be 3–20 characters')
      .isAlphanumeric()
      .withMessage('username must be alphanumeric'),
    validationErrors,
    putUser
  )
  .delete(authenticateToken, deleteUser);

export default userRouter;
