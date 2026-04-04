import promisePool from '../../utils/database.js';

// mock data
const catItems = [
  {
    cat_id: 9592,
    cat_name: 'Frank',
    weight: 11,
    owner: 3609,
    filename: 'f3dbafakjsdfhg4',
    birthdate: '2021-10-12',
  },
  {
    cat_id: 9590,
    cat_name: 'Mittens',
    weight: 8,
    owner: 3602,
    filename: 'f3dasdfkjsdfhgasdf',
    birthdate: '2021-10-12',
  },
];

const listAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT 
      c.*, 
      u.name AS owner_name
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
  `);
  console.log('rows', rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `
    SELECT 
      c.*, 
      u.name AS owner_name
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.cat_id = ?
    `,
    [id]
  );
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const findCatsByUserId = async (userId) => {
  const [rows] = await promisePool.execute(
    `
    SELECT 
      c.*, 
      u.name AS owner_name
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.owner = ?
    `,
    [userId]
  );
  return rows;
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const rows = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {cat_id: rows[0].insertId};
};

const modifyCat = async (cat, id, user) => {
  let sql;

  if (user.role === 'admin') {
    sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
      cat,
      id,
    ]);
  } else {
    sql = promisePool.format(
      `UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?`,
      [cat, id, user.user_id]
    );
  }

  const [rows] = await promisePool.execute(sql);
  console.log('rows', rows);

  if (rows.affectedRows === 0) {
    return false;
  }

  return {message: 'success'};
};

const removeCat = async (id, user) => {
  let sql;
  let params;

  if (user.role === 'admin') {
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ?';
    params = [id];
  } else {
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?';
    params = [id, user.user_id];
  }

  const [rows] = await promisePool.execute(sql, params);
  console.log('rows', rows);

  if (rows.affectedRows === 0) {
    return false;
  }

  return {message: 'success'};
};

export {
  listAllCats,
  findCatById,
  findCatsByUserId,
  addCat,
  modifyCat,
  removeCat,
};
