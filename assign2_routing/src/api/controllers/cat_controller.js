import {
  addCat,
  findCatById,
  listAllCats,
  updateCat,
  deleteCatModel,
} from '../models/cat_model.js';

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  const result = addCat(req.body);
  if (result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  const updated = updateCat(req.params.id, req.body);

  if (updated) {
    res.json({
      message: 'Cat updated successfully',
      updated,
    });
  } else {
    res.sendStatus(404);
  }

  res.sendStatus(200);
};

const deleteCat = (req, res) => {
  const ok = deleteCatModel(req.params.id);
  if (ok) {
    res.json({message: 'Cat deleted'});
  } else {
    res.sendStatus(404);
  }
  res.sendStatus(200);
};

export {getCat, getCatById, postCat, putCat, deleteCat};
