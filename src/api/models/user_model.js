import promisePool from '../../utils/database.js';

// mock data
const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3602,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@metropolia.fi',
    role: 'admin',
    password: 'password',
  },
];

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_users');
  console.log('rows', rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const findUserByUsername = async (username) => {
  const sql = `
    SELECT *
    FROM wsk_users
    WHERE username = ?
  `;
  const [rows] = await promisePool.execute(sql, [username]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  const {name, username, email, role, password} = user;
  const sql = `INSERT INTO wsk_users (name, username, email, role, password)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, role, password];
  const [rows] = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return {user_id: rows.insertId};
};

const updateUser = async (id, data, user) => {
  const fields = [];
  const params = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    params.push(data[key]);
  }

  let sql;

  if (user.role === 'admin') {
    sql = `UPDATE wsk_users SET ${fields.join(', ')} WHERE user_id = ?`;
    params.push(id);
  } else {
    sql = `UPDATE wsk_users SET ${fields.join(', ')} WHERE user_id = ? AND user_id = ?`;
    params.push(id, user.user_id);
  }

  const [rows] = await promisePool.execute(sql, params);

  if (rows.affectedRows === 0) {
    return false;
  }

  return {message: 'success'};
};

const deleteUserModel = async (id, user) => {
  const conn = await promisePool.getConnection();
  try {
    await conn.beginTransaction();

    let result;

    if (user.role === 'admin') {
      await conn.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);

      const [res] = await conn.execute(
        'DELETE FROM wsk_users WHERE user_id = ?',
        [id]
      );

      result = res;
    } else {
      await conn.execute('DELETE FROM wsk_cats WHERE owner = ? AND owner = ?', [
        id,
        user.user_id,
      ]);

      const [res] = await conn.execute(
        'DELETE FROM wsk_users WHERE user_id = ? AND user_id = ?',
        [id, user.user_id]
      );

      result = res;
    }

    await conn.commit();

    if (result.affectedRows === 0) {
      return false;
    }

    return {message: 'success'};
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export {
  listAllUsers,
  findUserById,
  findUserByUsername,
  addUser,
  updateUser,
  deleteUserModel,
};
