-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "aprobadoPor" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "fechaAprobacion" TIMESTAMP(3),
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaRechazo" TIMESTAMP(3),
ADD COLUMN     "motivoRechazo" TEXT,
ADD COLUMN     "rechazadoPor" TEXT;
