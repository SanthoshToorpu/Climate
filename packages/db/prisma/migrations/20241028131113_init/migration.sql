/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Merchant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnRampTransaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `K` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `N` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `P` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMonths` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humidity` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ph` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rainfall` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperature` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- DropForeignKey
ALTER TABLE "OnRampTransaction" DROP CONSTRAINT "OnRampTransaction_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_number_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "number",
DROP COLUMN "password",
ADD COLUMN     "K" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "N" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "P" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "crops" TEXT[],
ADD COLUMN     "durationMonths" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "humidity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ph" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "rainfall" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Balance";

-- DropTable
DROP TABLE "Merchant";

-- DropTable
DROP TABLE "OnRampTransaction";

-- DropEnum
DROP TYPE "AuthType";

-- DropEnum
DROP TYPE "onRampStatus";

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
