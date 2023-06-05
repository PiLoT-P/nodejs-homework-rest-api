const { HttpError } = require('../helpers');
const Contact = require('../models/contact')

const getContactsAll = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contacts = await Contact.find({owner}).populate('owner', '-_id email');
    res.json(contacts);
  } catch (err) {
    next(err);
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    const contact = await Contact.findOne({ _id: contactId, owner}).populate('owner', '-_id email');

    if (!contact) {
      throw HttpError(404, 'Not found');
    }

    res.json(contact)
  } catch (err) {
    next(err);
  }
}

const addContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    const contact = await Contact.create({...req.body, owner });

    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
}

const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    const contact = await Contact.deleteOne({ _id: contactId, owner });

    if (contact.deletedCount == 0) {
      throw HttpError(404, 'Not found')
    }

    res.json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
}

const updateContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    const updateContact = await Contact.updateOne({ _id: contactId, owner }, req.body, { new: true });

    if (updateContact.modifiedCount == 0) {
      throw HttpError(404, "Not found");
    }

    const contact = await Contact.findById(contactId)

    res.json(contact);
  } catch (err) {
    next(err);
  }
}

const updateFavorite = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const { _id: owner } = req.user;

    const updateContact = await Contact.updateOne({ _id: contactId, owner }, req.body, { new: true });

    if (updateContact.modifiedCount == 0) {
      throw HttpError(404, "Not found");
    }

    const contact = await Contact.findById(contactId)

    res.json(contact);
  } catch (err) {
    next(err);
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