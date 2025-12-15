/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `assignedOrderId` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `Label` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `Label` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Label" DROP COLUMN "assignedAt",
DROP COLUMN "assignedOrderId",
DROP COLUMN "postcode",
ADD COLUMN     "reference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Label_reference_key" ON "Label"("reference");
