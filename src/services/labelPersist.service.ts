import prisma from "../db/prismaClient";

export async function persistLabel(input: {
  pdfPath: string;
  metadata: {
    reference: string | null;
    fedexTracking: string | null;
  };
}) {
  if (!input.metadata.reference) {
    throw new Error("Missing REF (Linnworks OrderId)");
  }

  console.log("Persisting label for REF:", input.metadata.reference);
  console.log("With tracking number:", input.metadata.fedexTracking);
  console.log("PDF Path:", input.pdfPath);
  console.log("Current timestamp:", new Date().toISOString());

  await prisma.label.create({
    data: {
      reference: input.metadata.reference,
      trackingNumber: input.metadata.fedexTracking,
      pdfPath: input.pdfPath,
      status: "NEW",
      createdAt: new Date()
    }
  });
}