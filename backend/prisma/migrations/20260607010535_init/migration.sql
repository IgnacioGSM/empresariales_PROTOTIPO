/*
  Warnings:

  - You are about to drop the column `estado` on the `Trabajo` table. All the data in the column will be lost.
  - Added the required column `estadoOperativo` to the `Trabajo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trabajo" DROP COLUMN "estado",
ADD COLUMN     "estadoOperativo" TEXT NOT NULL,
ADD COLUMN     "resultado" TEXT;
