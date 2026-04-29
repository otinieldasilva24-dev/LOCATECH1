-- CreateTable
CREATE TABLE "saved_postos" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postoId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_postos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_postos_userId_postoId_key" ON "saved_postos"("userId", "postoId");

-- AddForeignKey
ALTER TABLE "saved_postos" ADD CONSTRAINT "saved_postos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_postos" ADD CONSTRAINT "saved_postos_postoId_fkey" FOREIGN KEY ("postoId") REFERENCES "postos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
