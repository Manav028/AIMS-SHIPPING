import { Request, Response } from "express";
import { success } from "../utils/response";

export async function userAvailableServicesController(
  req: Request,
  res: Response
) {
  return res.json(
    success({
      Services: [
        {
          ServiceName: "FedEx Prepaid",
          ServiceCode: "FEDEX_PREPAID",
          ServiceTag: "FEDEX",
          PrintLabel: true,
        },
      ],
    })
  );
}