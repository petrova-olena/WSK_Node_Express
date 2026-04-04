import {
  addUser,
  findUserById,
  listAllUsers,
  updateUser,
  deleteUserModel,
} from '../models/user_model.js';
import bcrypt from 'bcrypt';

const getUser = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const result = await addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putUser = async (req, res) => {
  const user = res.locals.user; // { user_id, role }
  const targetId = Number(req.params.id);

  if (user.role !== 'admin' && user.user_id !== targetId) {
    return res.status(403).json({message: 'Not allowed'});
  }

  const updated = await updateUser(targetId, req.body, res.locals.user);
  res.json(updated);
};

const deleteUser = async (req, res) => {
  const user = res.locals.user;
  const targetId = Number(req.params.id);

  if (user.role !== 'admin' && user.user_id !== targetId) {
    return res.status(403).json({message: 'Not allowed'});
  }

  const result = await deleteUserModel(targetId, res.locals.user);
  res.json({message: 'User deleted', result});
};

export {getUser, getUserById, postUser, putUser, deleteUser};
