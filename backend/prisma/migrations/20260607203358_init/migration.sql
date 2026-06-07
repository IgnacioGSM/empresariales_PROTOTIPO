-- AlterTable
ALTER TABLE "Conductor" ADD COLUMN     "documentacionVigente" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Vehiculo" ADD COLUMN     "documentacionVigente" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mantencionVigente" BOOLEAN NOT NULL DEFAULT true;
