import { Request, Response } from "express";
import { addNewUser } from "../services/account.service";
import { handleError } from "../utils/errorHandler";
import { success } from "../utils/response";

export async function addNewUserController(
  req: Request,
  res: Response
) {
  try {
    const token = await addNewUser(req.body);
    return res.json(success({ AuthorizationToken: token }));
  } catch (err) {
    return handleError(res, err, "AddNewUser");
  }
}