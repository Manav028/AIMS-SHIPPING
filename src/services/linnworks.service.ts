import { labelPoolService } from "./labelPool.service";
import fs from "fs";

export const linnworksService = {
  async userAvailableServices() {
    return {
      Services: [
        {
          Name: "FedEx Prepaid (Postcode Match)",
          Code: "fedex_prepaid",
          TrackingUrl: "https://www.fedex.com/fedextrack/?trknbr=",
          PrintLabel: true,
        },
      ],
    };
  },

  async generateLabel(request: any) {
    const orderId = request?.OrderId;
    const postcode = request?.Recipient?.PostCode;
    if (!postcode) throw new Error("Missing postcode");

    const label = await labelPoolService.findLabelByPostcode(postcode);
    if (!label) throw new Error("No matching label for postcode");

    await labelPoolService.assignLabel(label.id, orderId);
    const pdfBytes = fs.readFileSync(label.pdfPath);

    return { TrackingNumber: label.trackingNumber || "PREPAID", LabelBase64: pdfBytes.toString("base64"), Format: "PDF" };
  },

  async cancelLabel() {
    return { Success: true };
  },
};
