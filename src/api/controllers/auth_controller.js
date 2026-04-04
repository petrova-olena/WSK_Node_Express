import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {findUserByUsername} from '../models/user_model.js';
import 'dotenv/config';

// ----------------------
// POST /auth/login
// ----------------------
/**
 * @api {post} /api/v1/auth/login Login user
 * @apiName LoginUser
 * @apiGroup Auth
 *
 * @apiBody {String} username Username of the user
 * @apiBody {String} password Password of the user
 *
 * @apiSuccess {Object} user User data without password
 * @apiSuccess {String} token JWT token valid for 24 hours
 *
 * @apiError (401) Unauthorized Invalid username or password
 */

const postLogin = async (req, res, next) => {
  try {
    const user = await findUserByUsername(req.body.username);

    if (!user) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      return next(error);
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      return next(error);
    }

    const userWithNoPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({user: userWithNoPassword, token});
  } catch (err) {
    next(err);
  }
};

// ----------------------
// GET /auth/me
// ----------------------
/**
 * @api {get} /api/v1/auth/me Get authenticated user
 * @apiName GetMe
 * @apiGroup Auth
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {String} message Token status
 * @apiSuccess {Object} user Decoded user data
 *
 * @apiError (401) Unauthorized Missing or invalid token
 */

const getMe = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      const error = new Error('Unauthorized');
      error.status = 401;
      return next(error);
    }

    res.json({
      message: 'token ok',
      user: res.locals.user,
    });
  } catch (err) {
    next(err);
  }
};

export {postLogin, getMe};
