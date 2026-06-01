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
      create: { id: 3, nome: 'Gás', unidade_medida: 'Un' },
    });
    await prisma.produto.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, nome: 'Gás Butano', unidade_medida: 'Un' },
    });
    console.log('✅ Produtos criados');

    // Criar Gestor
    const hashedPassword = await bcrypt.hash('gestor123', 10);
    const gestorEmail = 'gestor@locatech.com';
    
    const gestor = await prisma.user.upsert({
      where: { email: gestorEmail },
      update: {
        nome: 'Garcilásio dos Santos',
        phone: '+244939549991',
        role: 'GESTOR',
      },
      create: {
        nome: 'Garcilásio dos Santos',
        email: gestorEmail,
        password: hashedPassword,
        phone: '+244939549991',
        role: 'GESTOR',
      },
    });
    console.log('✅ Gestor processado:', gestor.email);

    // Criar Posto
    const postoNif = '202220269';
    const posto = await prisma.posto.upsert({
      where: { nif: postoNif },
      update: {
        nome: 'PA Sonangol Mutilados',
        email_institucional: 'mutilados@sonangol.ao',
        tipo: 'MISTO',
        endereco: 'Luanda',
        latitude: -8.9025886,
        longitude: 13.3625418,
        horario_funcionamento: '24/24',
        gestorId: gestor.id,
      },
      create: {
        nome: 'PA Sonangol Mutilados',
        email_institucional: 'mutilados@sonangol.ao',
        nif: postoNif,
        tipo: 'MISTO',
        endereco: 'Luanda',
        latitude: -8.9025886,
        longitude: 13.3625418,
        horario_funcionamento: '24/24',
        gestorId: gestor.id,
      },
    });
    console.log('✅ Posto processado:', posto.nome);

    // --- STOCKS POSTO 1 (REAJUSTADOS PARA ESCALA 0-100 DO SENSOR) ---
    await prisma.stock.upsert({
      where: { id: 1 },
      update: {
        quantidade_atual: 71,
        capacidade_maxima: 100, // Ajustado para 100 para a percentagem bater certo
        preco_unitario: 300,
      },
      create: { id: 1, postoId: posto.id, produtoId: 1, quantidade_atual: 71, capacidade_maxima: 100, preco_unitario: 300 },
    });
    await prisma.stock.upsert({
      where: { id: 2 },
      update: {
        quantidade_atual: 71,
        capacidade_maxima: 100, // Ajustado para 100 para a percentagem bater certo
        preco_unitario: 400,
      },
      create: { id: 2, postoId: posto.id, produtoId: 2, quantidade_atual: 71, capacidade_maxima: 100, preco_unitario: 400 },
    });
    await prisma.stock.upsert({
      where: { id: 3 },
      update: {
        quantidade_atual: 18,
        capacidade_maxima: 30,  // Definido um máximo realista para contagem física (18 de 30)
        preco_unitario: 1200,
      },
      create: { id: 3, postoId: posto.id, produtoId: 3, quantidade_atual: 18, capacidade_maxima: 30, preco_unitario: 1200 },
    });
    console.log('✅ Stocks criados/atualizados');

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

    // Stocks - Posto 2
    await prisma.stock.upsert({
      where: { id: 4 },
      update: {
        quantidade_atual: 80,
        capacidade_maxima: 100,
        preco_unitario: 865,
      },
      create: { id: 4, postoId: posto2.id, produtoId: 1, quantidade_atual: 80, capacidade_maxima: 100, preco_unitario: 865 },
    });
    await prisma.stock.upsert({
      where: { id: 5 },
      update: {
        quantidade_atual: 50,
        capacidade_maxima: 100,
        preco_unitario: 715,
      },
      create: { id: 5, postoId: posto2.id, produtoId: 2, quantidade_atual: 50, capacidade_maxima: 100, preco_unitario: 715 },
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