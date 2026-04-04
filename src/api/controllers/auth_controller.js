import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {findUserByUsername} from '../models/user_model.js';
import 'dotenv/config';

// ----------------------
// POST /auth/login
// ----------------------
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
