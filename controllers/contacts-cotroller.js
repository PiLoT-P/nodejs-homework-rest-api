const { HttpError } = require('../helpers');
const Contact = require('../models/contact')

const getContactsAll = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw HttpError(404,'Not found');
    }

    res.json(contact)
  } catch (err) {
    next(err);
  }
}

const addContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
}

const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const getContact = await Contact.findById(contactId); 

    if (!getContact) {
      throw HttpError(404, 'Not found')
    }

    const contact = await Contact.findByIdAndDelete(contactId);

    res.json({message: "contact deleted"});
  } catch (err) {
    next(err);
  }
}

const updateContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    res.json(contact);
  } catch (err) {
    next(err);
  }
}

const updateFavorite = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    res.json(contact);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getContactsAll,
  getContactById,
  addContact,
  deleteContactById,
  updateContactById,
  updateFavorite,
}