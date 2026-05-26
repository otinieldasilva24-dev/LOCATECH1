import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export async function main() {
  console.log('🌱 A iniciar seed...');

  try {
    // Criar Produtos
    await prisma.produto.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nome: 'Gasolina', unidade_medida: 'L' },
    });
    await prisma.produto.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, nome: 'Gasóleo', unidade_medida: 'L' },
    });
    await prisma.produto.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, nome: 'Gás', unidade_medida: 'L' },
    });
    await prisma.produto.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, nome: 'Gás Butano', unidade_medida: 'L' },
    });
    console.log('✅ Produtos criados');

    // Criar Gestor
    const hashedPassword = await bcrypt.hash('gestor123', 10);
    const gestor = await prisma.user.upsert({
      where: { email: 'gestor@locatech.com' },
      update: {},
      create: {
        nome: 'Carlos Manuel',
        email: 'gestor@locatech.com',
        password: hashedPassword,
        phone: '+244912345678',
        role: 'GESTOR',
      },
    });
    console.log('✅ Gestor criado:', gestor.email);

    // Criar Posto
    const posto = await prisma.posto.upsert({
      where: { nif: '541234567' },
      update: {},
      create: {
        nome: 'Shell Kinaxixi',
        email_institucional: 'kinaxixi@shell.ao',
        nif: '541234567',
        tipo: 'COMBUSTIVEL',
        endereco: 'Luanda',
        latitude: -8.83682,
        longitude: 13.23437,
        horario_funcionamento: '07h–22h',
        gestorId: gestor.id,
      },
    });
    console.log('✅ Posto criado:', posto.nome);

    // Stocks
    await prisma.stock.upsert({
      where: { id: 1 },
      update: {},
      create: { postoId: posto.id, produtoId: 1, quantidade_atual: 15000, capacidade_maxima: 20000, preco_unitario: 870 },
    });
    await prisma.stock.upsert({
      where: { id: 2 },
      update: {},
      create: { postoId: posto.id, produtoId: 2, quantidade_atual: 12000, capacidade_maxima: 15000, preco_unitario: 720 },
    });
    await prisma.stock.upsert({
      where: { id: 3 },
      update: {},
      create: { postoId: posto.id, produtoId: 3, quantidade_atual: 5000, capacidade_maxima: 8000, preco_unitario: 1100 },
    });
    console.log('✅ Stocks criados');

    // Cliente
    const clientePassword = await bcrypt.hash('cliente123', 10);
    await prisma.user.upsert({
      where: { email: 'cliente@email.com' },
      update: {},
      create: {
        nome: 'João Silva',
        email: 'cliente@email.com',
        password: clientePassword,
        phone: '+244923456789',
        role: 'MEMBER',
      },
    });
    console.log('✅ Cliente criado: cliente@email.com');

    // Segundo Posto
    const posto2 = await prisma.posto.upsert({
      where: { nif: '987654321' },
      update: {},
      create: {
        nome: 'Sonangol Central',
        email_institucional: 'central@sonangol.ao',
        nif: '987654321',
        tipo: 'MISTO',
        endereco: 'Luanda',
        latitude: -8.8392,
        longitude: 13.2564,
        horario_funcionamento: '06h–23h',
        gestorId: gestor.id,
      },
    });
    console.log('✅ Posto 2 criado:', posto2.nome);

    await prisma.stock.upsert({
      where: { id: 4 },
      update: {},
      create: { postoId: posto2.id, produtoId: 1, quantidade_atual: 8000, capacidade_maxima: 15000, preco_unitario: 865 },
    });
    await prisma.stock.upsert({
      where: { id: 5 },
      update: {},
      create: { postoId: posto2.id, produtoId: 2, quantidade_atual: 10000, capacidade_maxima: 12000, preco_unitario: 715 },
    });

    console.log('🌱 Seed concluído!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
