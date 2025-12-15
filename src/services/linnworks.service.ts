import prisma from "../db/prismaClient";
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
    if (!orderId) throw new Error("Missing OrderId");

    const label = await prisma.label.findUnique({
      where: { reference: orderId }
    });

    if (!label) {
      throw new Error("No prepaid label found for this OrderId");
    }

    if (label.status !== "NEW") {
      throw new Error("Label already used");
    }

    await prisma.label.update({
      where: { id: label.id },
      data: {
        status: "ASSIGNED",
        assignedAt: new Date()
      }
    });

    const pdfBytes = fs.readFileSync(label.pdfPath);

    return {
      TrackingNumber: label.trackingNumber || "PREPAID",
      LabelBase64: pdfBytes.toString("base64"),
      Format: "PDF"
    };
  },

  async cancelLabel(request: any) {
    const orderId = request?.OrderId;

    await prisma.label.update({
      where: { reference: orderId },
      data: { status: "NEW", assignedAt: null }
    });

    return { Success: true };
  }
};
