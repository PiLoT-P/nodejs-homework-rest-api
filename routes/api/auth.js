const express = require('express')
const router = express.Router()

const authController = require('../../controllers/auth-controller');
const { validateBody } = require('../../Utils');
const {userRegisterSchema, userLoginSchema, verifySchema} = require('../../schema/user');
const { authenticate, upload } = require('../../middlewares');

router.post('/register', validateBody(userRegisterSchema), authController.register);

router.get('/verify/:verificationToken', authController.varify);

router.post('/verify', validateBody(verifySchema), authController.verifyAgain)

router.post('/login', validateBody(userLoginSchema), authController.login);

router.get('/current', authenticate, authController.getCurrent);

router.post('/logout', authenticate, authController.logout);

router.patch('/avatars', authenticate, upload.single('avatar'), authController.updateAvatar);


module.exports = router