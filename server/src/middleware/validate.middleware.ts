import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ err: true, msg: error.details[0].message });
    } else {
      req.body = value;
    }

    next();
  };
};
