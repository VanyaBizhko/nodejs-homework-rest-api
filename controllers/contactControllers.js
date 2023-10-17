const Contact = require("../models/contacts");
const { cntrlWrapper,HttpError } = require("../helpers");

const getAll = async (req, res) => {
  const result = await Contact.find();
  console.log(result);
  res.json(result);
};
const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOne({_id: id});

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};
const addContact = async (req, res) => {
 
  const result = await Contact.create(req.body);

  res.status(201).json(result);
};
const removeContact = async (req, res) => {
  const { id } = req.params;

  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Delete success",
  });
};
const updateContact = async (req, res) => {

  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);
  res.json(result);
};
const updateFavorite = async (req, res) => {

  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);
  res.json(result);
};

module.exports = {
  getAll: cntrlWrapper(getAll),
  getContactById: cntrlWrapper(getContactById),
  addContact: cntrlWrapper(addContact),
  removeContact: cntrlWrapper(removeContact),
  updateContact: cntrlWrapper(updateContact),
  updateFavorite: cntrlWrapper(updateFavorite),
};