/*
  Warnings:

  - A unique constraint covering the columns `[latitude,longitude]` on the table `postos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "postos_latitude_longitude_key" ON "postos"("latitude", "longitude");
