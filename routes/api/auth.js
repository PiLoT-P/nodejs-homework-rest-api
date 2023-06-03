const express = require('express')
const router = express.Router()

const authController = require('../../controllers/auth-controller');
const { validateBody } = require('../../Utils');
const {userRegisterSchema, userLoginSchema} = require('../../schema/user');
const { authenticate } = require('../../middlewares');

router.post('/users/register', validateBody(userRegisterSchema), authController.register);

router.post('/users/login', validateBody(userLoginSchema), authController.login);

router.get('/users/current', authenticate, authController.getCurrent);

router.post('/users/logout', authenticate, authController.logout);


module.exports = router