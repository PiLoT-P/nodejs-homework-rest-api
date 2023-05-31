const express = require('express')
const router = express.Router()

const contactsController = require('../../controllers/contacts-cotroller');
const { isValidId } = require('../../middlewares')
const { validateBody, validateBodyFavorite } = require('../../Utils');
const schema = require('../../schema/contacts');


router.get('/', contactsController.getContactsAll);

router.get('/:contactId', isValidId, contactsController.getContactById);

router.post('/', validateBody(schema.contactAddSchema), contactsController.addContact);

router.delete('/:contactId', isValidId, contactsController.deleteContactById);

router.put('/:contactId', isValidId, validateBody(schema.contactUpdateSchema), contactsController.updateContactById);

router.patch('/:contactId/favorite', isValidId, validateBodyFavorite(schema.contactUpdateFavoriteSchema),  contactsController.updateFavorite);

module.exports = router
