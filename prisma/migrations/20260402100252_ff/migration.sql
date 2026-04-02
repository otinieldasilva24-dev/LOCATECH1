/*
  Warnings:

  - You are about to alter the column `preco_unitario` on the `stocks` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - A unique constraint covering the columns `[nif]` on the table `postos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gestorId` to the `postos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nif` to the `postos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GESTOR';

-- DropIndex
DROP INDEX "postos_latitude_longitude_key";

-- AlterTable
ALTER TABLE "postos" ADD COLUMN     "alvara_path" TEXT,
ADD COLUMN     "email_institucional" TEXT,
ADD COLUMN     "gestorId" INTEGER NOT NULL,
ADD COLUMN     "horario_funcionamento" TEXT,
ADD COLUMN     "nif" TEXT NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "stocks" ALTER COLUMN "quantidade_atual" SET DEFAULT 0,
ALTER COLUMN "capacidade_maxima" SET DEFAULT 0,
ALTER COLUMN "preco_unitario" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "postos_nif_key" ON "postos"("nif");

-- AddForeignKey
ALTER TABLE "postos" ADD CONSTRAINT "postos_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
