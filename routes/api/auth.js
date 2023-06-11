const express = require('express')
const router = express.Router()

const authController = require('../../controllers/auth-controller');
const { validateBody } = require('../../Utils');
const {userRegisterSchema, userLoginSchema} = require('../../schema/user');
const { authenticate } = require('../../middlewares');

router.post('/register', validateBody(userRegisterSchema), authController.register);

router.post('/login', validateBody(userLoginSchema), authController.login);

router.get('/current', authenticate, authController.getCurrent);

router.post('/logout', authenticate, authController.logout);


module.exports = router