const Joi = require('joi');

const userRegisterSchema = Joi.object({
    password: Joi.string().min(8).required(),
    email: Joi.string().required(),
    subscription: Joi.string().default('starter'),
})

const userLoginSchema = Joi.object({
    password: Joi.string().min(8).required(),
    email: Joi.string().required(),
})

module.exports = {
    userRegisterSchema,
    userLoginSchema,
}