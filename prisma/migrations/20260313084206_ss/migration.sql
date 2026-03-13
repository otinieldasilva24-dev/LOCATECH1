/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessagesOff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `React` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PostoType" AS ENUM ('COMBUSTIVEL', 'GAS', 'MISTO');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postsId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "MessagesOff" DROP CONSTRAINT "MessagesOff_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "MessagesOff" DROP CONSTRAINT "MessagesOff_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_userId_fkey";

-- DropForeignKey
ALTER TABLE "React" DROP CONSTRAINT "React_postsId_fkey";

-- DropForeignKey
ALTER TABLE "React" DROP CONSTRAINT "React_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userId_fkey";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "MessagesOff";

-- DropTable
DROP TABLE "Posts";

-- DropTable
DROP TABLE "React";

-- DropTable
DROP TABLE "messages";

-- CreateTable
CREATE TABLE "postos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "PostoType" NOT NULL DEFAULT 'MISTO',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "endereco" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "unidade_medida" TEXT NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" SERIAL NOT NULL,
    "quantidade_atual" DOUBLE PRECISION NOT NULL,
    "capacidade_maxima" DOUBLE PRECISION NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "postoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_postoId_fkey" FOREIGN KEY ("postoId") REFERENCES "postos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
