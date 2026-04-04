import {
  addUser,
  findUserById,
  listAllUsers,
  updateUser,
  deleteUserModel,
} from '../models/user_model.js';
import bcrypt from 'bcrypt';

// ----------------------
// GET /users
// ----------------------
/**
 * @api {get} /api/v1/users Get all users
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiSuccess {Object[]} users List of users
 */

const getUser = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// ----------------------
// GET /users/:id
// ----------------------
/**
 * @api {get} /api/v1/users/:id Get user by ID
 * @apiName GetUserById
 * @apiGroup Users
 *
 * @apiParam {Number} id User ID
 *
 * @apiSuccess {Object} user User data
 * @apiError (404) NotFound User not found
 */

const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ----------------------
// POST /users
// ----------------------
/**
 * @api {post} /api/v1/users Create new user
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiBody {String} email User email
 * @apiBody {String} username Username
 * @apiBody {String} password Password
 *
 * @apiSuccess (201) {Object} result Created user ID
 * @apiError (400) BadRequest Validation error
 */

const postUser = async (req, res, next) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    // defaults to avoid undefined → SQL error
    req.body.role = req.body.role || 'user';
    req.body.name = req.body.name || req.body.username;

    const result = await addUser(req.body);

    if (!result || result.error) {
      const error = new Error(result?.error || 'Failed to create user');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({message: 'New user added', result});
  } catch (err) {
    next(err);
  }
};

// ----------------------
// PUT /users/:id
// ----------------------
/**
 * @api {put} /api/v1/users/:id Update user
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id User ID
 *
 * @apiSuccess {Object} result Update status
 * @apiError (403) Forbidden Not allowed
 * @apiError (400) BadRequest Validation error
 */

const putUser = async (req, res, next) => {
  try {
    const user = res.locals.user; // { user_id, role }
    const targetId = Number(req.params.id);

    // Permission check
    if (user.role !== 'admin' && user.user_id !== targetId) {
      const error = new Error('Not allowed');
      error.status = 403;
      return next(error);
    }

    const updated = await updateUser(targetId, req.body, user);

    if (!updated) {
      const error = new Error('Failed to update user');
      error.status = 400;
      return next(error);
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ----------------------
// DELETE /users/:id
// ----------------------
/**
 * @api {delete} /api/v1/users/:id Delete user
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id User ID
 *
 * @apiSuccess {Object} result Deletion status
 * @apiError (403) Forbidden Not allowed
 * @apiError (404) NotFound User not found
 */

const deleteUser = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const targetId = Number(req.params.id);

    // Permission check
    if (user.role !== 'admin' && user.user_id !== targetId) {
      const error = new Error('Not allowed');
      error.status = 403;
      return next(error);
    }

    const result = await deleteUserModel(targetId, user);

    if (!result) {
      const error = new Error('Failed to delete user');
      error.status = 400;
      return next(error);
    }

    res.json({message: 'User deleted', result});
  } catch (err) {
    next(err);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
