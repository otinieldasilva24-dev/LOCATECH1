-- CreateTable
CREATE TABLE "comunidades" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comunidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunidade_membros" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comunidade_id" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comunidade_membros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "convites" (
    "id" SERIAL NOT NULL,
    "de_user_id" INTEGER NOT NULL,
    "para_user_id" INTEGER NOT NULL,
    "comunidade_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "convites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comunidade_membros_user_id_comunidade_id_key" ON "comunidade_membros"("user_id", "comunidade_id");

-- AddForeignKey
ALTER TABLE "comunidades" ADD CONSTRAINT "comunidades_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_membros" ADD CONSTRAINT "comunidade_membros_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_membros" ADD CONSTRAINT "comunidade_membros_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "comunidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convites" ADD CONSTRAINT "convites_de_user_id_fkey" FOREIGN KEY ("de_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convites" ADD CONSTRAINT "convites_para_user_id_fkey" FOREIGN KEY ("para_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convites" ADD CONSTRAINT "convites_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "comunidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
