import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().required(),
  email: Joi.string().optional(),
});

export const updateNameSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().required(),
});
