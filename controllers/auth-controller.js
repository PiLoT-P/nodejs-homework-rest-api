const { HttpError } = require('../helpers');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const {SECRET_KEY} = process.env
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar')
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp')

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

        const newUser = await User.create({ password: hashedPassword, email, subscription, avatarURL});

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

module.exports = {
    register,
    login,
    getCurrent,
    logout,
    updateAvatar,
}