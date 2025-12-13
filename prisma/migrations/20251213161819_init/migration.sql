-- CreateEnum
CREATE TYPE "LabelStatus" AS ENUM ('NEW', 'ASSIGNED', 'USED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "postcode" TEXT,
    "pdfPath" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "status" "LabelStatus" NOT NULL DEFAULT 'NEW',
    "assignedOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedAt" TIMESTAMP(3),

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConfig" (
    "id" SERIAL NOT NULL,
    "linnworksAccountId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserConfig_linnworksAccountId_key" ON "UserConfig"("linnworksAccountId");
