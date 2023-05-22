const express = require('express')
const router = express.Router()

const contactsController = require('../../controllers/contacts-cotroller');
const { validateBody } = require('../../Utils');
const { contactAddSchema } = require('../../schema');

router.get('/', contactsController.getContactsAll);

router.get('/:contactId', contactsController.getContactById);

router.post('/', validateBody(contactAddSchema) ,contactsController.addContact);

router.delete('/:contactId', contactsController.deleteContactById);

router.put('/:contactId', validateBody(contactAddSchema), contactsController.updateContactById);

module.exports = router
