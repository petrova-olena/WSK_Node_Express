import {
  addCat,
  findCatById,
  listAllCats,
  findCatsByUserId,
  modifyCat,
  removeCat,
} from '../models/cat_model.js';

// ----------------------
// GET /cats
// ----------------------
const getCat = async (req, res, next) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (err) {
    next(err);
  }
};

// ----------------------
// GET /cats/:id
// ----------------------
const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);

    if (!cat) {
      const error = new Error('Cat not found');
      error.status = 404;
      return next(error);
    }

    res.json(cat);
  } catch (err) {
    next(err);
  }
};

// ----------------------
// GET /cats/user/:id
// ----------------------
const getCatsByUserId = async (req, res, next) => {
  try {
    const cats = await findCatsByUserId(req.params.id);
    res.json(cats);
  } catch (err) {
    next(err);
  }
};

// ----------------------
// POST /cats
// ----------------------
const postCat = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Invalid or missing file');
      error.status = 400;
      return next(error);
    }

    const newCat = {
      ...req.body,
      filename: req.file.filename,
    };

    const result = await addCat(newCat);

    if (!result || result.error) {
      const error = new Error(result?.error || 'Failed to add cat');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({message: 'New cat added', result});
  } catch (err) {
    next(err);
  }
};

// ----------------------
// PUT /cats/:id
// ----------------------
const putCat = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const catId = req.params.id;

    // Check permissions
    if (user.role !== 'admin') {
      const cat = await findCatById(catId);

      if (!cat) {
        const error = new Error('Cat not found');
        error.status = 404;
        return next(error);
      }

      if (cat.owner !== user.user_id) {
        const error = new Error('Not allowed');
        error.status = 403;
        return next(error);
      }
    }

    const updated = await modifyCat(req.body, catId, user);

    if (!updated) {
      const error = new Error('Failed to update cat');
      error.status = 400;
      return next(error);
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ----------------------
// DELETE /cats/:id
// ----------------------
const deleteCat = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const catId = req.params.id;

    // Check permissions
    if (user.role !== 'admin') {
      const cat = await findCatById(catId);

      if (!cat) {
        const error = new Error('Cat not found');
        error.status = 404;
        return next(error);
      }

      if (cat.owner !== user.user_id) {
        const error = new Error('Not allowed');
        error.status = 403;
        return next(error);
      }
    }

    const result = await removeCat(catId, user);

    if (!result) {
      const error = new Error('Failed to delete cat');
      error.status = 400;
      return next(error);
    }

    res.json({message: 'Cat deleted', result});
  } catch (err) {
    next(err);
  }
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};
