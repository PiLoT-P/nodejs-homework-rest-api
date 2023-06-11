const { HttpError, sendEmail } = require('../helpers');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const {SECRET_KEY, BASE_URL, PORT} = process.env
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar')
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');
const shortid = require('shortid');

const avatarDir = path.resolve('public', 'avatars')

const register = async (req, res, next) => {
    try {
        const { password, email, subscription } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            throw HttpError(409, 'Email in use')
        }

        const avatarURL = gravatar.url(email); 

        const hashedPassword = await bcrypt.hash(password, 10) 

        const verificationToken = shortid.generate();

        const newUser = await User.create({ password: hashedPassword, email, subscription, avatarURL, verificationToken });
        
        const verifyLink = `${BASE_URL}:${PORT}/users/verify/${verificationToken}`

        const verifyEmail = {
            to: email,
            subject: "Verification",
            html: verifyLink
        }
        await sendEmail(verifyEmail);

        res.status(201).json({
            user: {
                email,
                subscription,
                avatarURL
            }
        });
    } catch (err) {
        next(err);
    }
}

const login = async (req, res, next,) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        const { subscription } = user;

        if (!user) {
            throw HttpError(401, 'Email or password is wrong');
        }

        if (!user.verify) {
            throw HttpError(401, 'Email not verified');
        }

        const passwordCompareResult = await bcrypt.compare(password, user.password);

        if (!passwordCompareResult) {
            throw HttpError(401, 'Email or password is wrong');
        }

        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        await User.findByIdAndUpdate(user._id, { token });
        res.json({
            token,
            user: {
                email,
                subscription
            }
        })
    } catch (err) {
        next(err)
    }
}

const getCurrent = async (req, res, next) => {
    try {
        const { email, subscription, avatarURL } = req.user;

        res.json({
            email,
            subscription,
            avatarURL,
        })
    } catch (err) {
        next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        const { _id: id } = req.user;
        await User.findByIdAndUpdate(id, { token: '' });

        res.status(204).json();
    } catch (err) {
        next(err);
    }
}

const updateAvatar = async (req, res, next) => {
    try {
        const { path: tempPath, originalname} = req.file;
        const { _id } = req.user; 

        const resultDir = path.join(avatarDir, `${_id}-${originalname}`);
        
        fs.rename(tempPath, resultDir);

        const img = await Jimp.read(resultDir);
        img.resize(250, 250, Jimp.RESIZE_BEZIER, (err) => {
            if (err) throw err;
        })
            .write(resultDir);

        const avatarURL = path.join('avatars', `${_id}-${originalname}`);

        await User.findByIdAndUpdate(_id, { avatarURL });

        res.json({
            avatarURL
        });
    } catch (err) {
        next(err);
    }
}

const varify = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;

        const user = await User.findOne({ verificationToken });

        if (!user) {
            throw HttpError(401, 'User not found');
        }

        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });

        res.json({
            message: 'Email verified'
        })
    } catch (err) {
        next(err)
    }
}

const verifyAgain = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({email})

        if (!user) {
            throw HttpError(401, 'Email or password is wrong');
        }

        if (user.verify) {
            throw HttpError(400, 'Verification has already been passed')
        }
        
        const verificationToken = shortid.generate();

        await User.findByIdAndUpdate(user._id, {verificationToken})

        const verifyLink = `${BASE_URL}:${PORT}/users/verify/${verificationToken}`

        const verifyEmail = {
            to: email,
            subject: "Verification",
            html: verifyLink
        }

        await sendEmail(verifyEmail);

        res.json({
            message: 'Verification email sent'
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    getCurrent,
    logout,
    updateAvatar,
    varify,
    verifyAgain,
}