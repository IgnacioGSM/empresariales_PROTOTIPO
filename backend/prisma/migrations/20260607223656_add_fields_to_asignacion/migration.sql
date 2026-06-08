/*
  Warnings:

  - Added the required column `cargaAsignada` to the `Asignacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asignacion" ADD COLUMN     "cargaAsignada" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cargaEntregada" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rutaPlanificada" TEXT;
