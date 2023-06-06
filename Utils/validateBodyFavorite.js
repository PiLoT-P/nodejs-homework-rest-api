const { HttpError } = require("../helpers");

const validateBodyFavorite = schema => {
    const func = (req, res, next) => {
        const bodyLength = Object.values(req.body).length;

        if (!bodyLength) {
            throw HttpError(400, 'missing field favorite');
        }

        next();
    }
    return func;
}

module.exports = validateBodyFavorite;