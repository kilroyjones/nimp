import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().required(),
  email: Joi.string().optional(),
});

export const changePasswordSchema = Joi.object({
  token: Joi.string().required(),
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
