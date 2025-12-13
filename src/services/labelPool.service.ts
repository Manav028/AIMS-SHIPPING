import prisma from "../db/prismaClient";

export const labelPoolService = {
  async addLabel(pdfPath: string, postcode?: string | null) {
    return prisma.label.create({ data: { pdfPath, postcode: postcode || null } });
  },

  async findLabelByPostcode(postcode: string) {
    return prisma.label.findFirst({
      where: { postcode, status: "NEW" },
      orderBy: { createdAt: "asc" },
    });
  },

  async assignLabel(id: number, orderId: string) {
    return prisma.label.update({
      where: { id },
      data: { status: "ASSIGNED", assignedOrderId: orderId, assignedAt: new Date() },
    });
  },

  async setUsed(id: number) {
    return prisma.label.update({ where: { id }, data: { status: "USED" } });
  },
};
