import { Response, Request } from "express";

export const sendOk = (res: Response, data: any) => {
  return res.status(200).json({ err: false, msg: data });
};

export const sendCreated = (res: Response, data: any) => {
  return res.status(201).json({ err: false, msg: data });
};

export const sendError = (res: Response, msg: string, status: number = 500) => {
  return res.status(status).json({ e: true, msg: msg });
};

export const sendNotFound = (res: Response, msg: string) => {
  return res.status(404).json({ err: true, msg: msg });
};

export const sendAccepted = (res: Response, data: any) => {
  return res.status(202).json({ err: false, msg: data });
};

export const sendUnauthorized = (res: Response, data: any) => {
  return res.status(401).json({ err: true, msg: data });
};

export const sendAlreadyAuthenticated = (
  res: Response,
  message: string = "User is already authenticated"
) => {
  return res.status(409).json({ err: message, msg: message });
};
