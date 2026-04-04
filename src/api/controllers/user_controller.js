import {
  addUser,
  findUserById,
  listAllUsers,
  updateUser,
  deleteUserModel,
} from '../models/user_model.js';

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
  const result = await addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putUser = async (req, res) => {
  const updated = await updateUser(req.params.id, req.body);

  if (updated) {
    res.json({
      message: 'User updated successfully',
      updated,
    });
  } else {
    res.sendStatus(404);
  }
};

const deleteUser = async (req, res) => {
  const ok = await deleteUserModel(req.params.id);
  if (ok) {
    res.json({message: 'User deleted'});
  } else {
    res.sendStatus(404);
  }
  res.sendStatus(200);
};

export {getUser, getUserById, postUser, putUser, deleteUser};
