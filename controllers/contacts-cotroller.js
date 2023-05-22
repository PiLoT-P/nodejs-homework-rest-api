const contactsService = require('../models/contacts');
const { HttpError } = require('../helpers');

const getContactsAll = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);

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
    const { name, email, phone } = req.body;

    const contact = await contactsService.addContact({ name, email, phone });
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
}

const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const getContact = await contactsService.getContactById(contactId); 

    if (!getContact) {
      throw HttpError(404, 'Not found')
    }

    const contact = await contactsService.removeContact(contactId);

    res.json({message: "contact deleted"});
  } catch (err) {
    next(err);
  }
}

const updateContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const { name, email, phone } = req.body;

    const contact = await contactsService.updateContact(contactId, { name, email, phone });

    if (!contact) {
      throw HttpError(404, "Not found");
    }

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
}