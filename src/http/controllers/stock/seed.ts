
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

 export async function Seed() {
  await prisma.produto.createMany({
    data: [
      { id: 1, nome: "Gasolina",  unidade_medida: "L" },
      { id: 2, nome: "Gasóleo",   unidade_medida: "L" },
      { id: 3, nome: "Gás",       unidade_medida: "Kg" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Produtos criados");
}

