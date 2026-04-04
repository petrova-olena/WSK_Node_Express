import {
  addCat,
  findCatById,
  listAllCats,
  findCatsByUserId,
  modifyCat,
  removeCat,
} from '../models/cat_model.js';

const getCat = async (req, res) => {
  const cats = await listAllCats();
  res.json(cats);
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const getCatsByUserId = async (req, res) => {
  const cats = await findCatsByUserId(req.params.id);
  res.json(cats);
};

const postCat = async (req, res) => {
  const result = await addCat({
    ...req.body,
    filename: req.file?.filename,
  });
  if (result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
    console.log('FORM DATA:', req.body);
    console.log('FILE DATA:', req.file);
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const updated = await modifyCat(req.body, req.params.id);

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

const deleteCat = async (req, res) => {
  const deleted = await removeCat(req.params.id);
  if (deleted) {
    res.json({message: 'Cat deleted'});
  } else {
    res.sendStatus(404);
  }
  res.sendStatus(200);
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};
