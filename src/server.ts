import Fastify from "fastify";
import { Server } from "socket.io";
import cors from '@fastify/cors';
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';

import { prisma } from "@/lib/prisma";
import { env } from "./Env";
import { UsersRoutes } from "./http/controllers/users/routes";
import { PostosRoutes } from "./http/controllers/postos/routes";
import { StocksRoutes } from "./http/controllers/stock/routes";
import { SavedPostosRoutes } from "./http/controllers/saved-postos/routes";
import { ProdutosRoutes } from "./http/controllers/produtos/routes";
import { ComunidadeRoutes } from "./http/controllers/comunidade/routes";
import { Seed } from "./http/controllers/stock/seed";
import { main } from "prisma/seed";
import { setIO } from "@/lib/socket-provider";

const app = Fastify();
const server = app.server;

app.register(cors, {
  origin: ['https://quintal.onrender.com', 'http://localhost:5000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
});

app.register(multipart);

// Servir uploads com caminho absoluto
const projectRoot = path.resolve(__dirname, '../../');
const uploadPath = path.join(projectRoot, 'uploads');
console.log("Servindo uploads de:", uploadPath);

app.register(fastifyStatic, {
  root: uploadPath,
  prefix: "/uploads/",
  decorateReply: false,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: { expiresIn: '10m' }
});

app.register(fastifyCookie);
main();

export const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://quintal.onrender.com'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);
  socket.on("register", async (userId) => {
    socket.join(userId);
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (user && (user.role === "GESTOR" || user.role === "ADMIN")) {
      socket.join("monitoramento");
    }
  });
  socket.on("disconnect", () => console.log("❌ Cliente desconectado."));
});

// Disponibiliza o Socket.IO globalmente para os controladores
setIO(io);

// --- ROTA DOS SENSORES COM VALIDAÇÃO ANTI-CRASH E ATUALIZAÇÃO DE DISPONIBILIDADE ---
app.post('/sensor', async (request, reply) => {
  const data = request.body as any;

  // Validação para evitar envio de dados nulos ao frontend
  if (!data || !data.id) {
    return reply.status(400).send({ error: "Dados incompletos" });
  }

  // Garante que campos numéricos não sejam nulos para evitar erro de .toFixed no dashboard
  const cleanData = {
    ...data,
    temp: data.temp ?? 0,
    humi: data.humi ?? 0,
    stock: data.stock ?? 0
  };

  console.log(`📡 [${cleanData.id}] Real-time Update: T:${cleanData.temp} S:${cleanData.stock}`);

  // --- GRAVAÇÃO AUTOMÁTICA DA DISPONIBILIDADE NA BASE DE DADOS ---
  try {
    const postoNif = '202220269';   // NIF do posto "PA Sonangol Mutilados" configurado no seed
    let produtosParaAtualizar: number[] = [];

    // Define quais IDs de produto atualizar com base no identificador do sensor
    if (cleanData.id === 'esp2') {
      produtosParaAtualizar = [3];  // ID 3 = Gás
    } else {
      produtosParaAtualizar = [1, 2]; // ID 1 = Gasolina E ID 2 = Gasóleo (Usam o mesmo dado do sensor)
    }

    // Faz o update na tabela Stock cruzando a lista de IDs de produtos e o NIF do posto associado
    await prisma.stock.updateMany({
      where: {
        produtoId: {
          in: produtosParaAtualizar // O operador 'in' atualiza todos os IDs presentes no array de uma só vez
        },
        posto: {
          nif: postoNif
        }
      },
      data: {
        quantidade_atual: Number(cleanData.stock) // Salva os valores reais medidos pelo sensor
      }
    });

    console.log(`✅ DB Atualizada para o sensor ${cleanData.id} (Produtos: ${produtosParaAtualizar.join(', ')})`);

  } catch (prismaError) {
    console.error(`❌ Erro ao salvar dados do ${cleanData.id} no Prisma:`, prismaError);
  }

  // --- CONTROLO DINÂMICO DE CORES PARA O FRONTEND VIA WEBSOCKET ---
  if (cleanData.id === 'esp2') {
    // É o sensor do Gás -> Envia um ID diferente de 'esp1' para acionar o 'else' da sua função de cores.
    // Com o valor 18, cairá no intervalo de 11 a 20 (Amarelo).
    io.to("monitoramento").emit('monitoramento_update', {
      ...cleanData,
      id: 'esp2' 
    });
  } else {
    // É a Gasolina/Gasóleo -> Envia explicitamente com o id: 'esp1' para forçar o frontend
    // a validar as percentagens. Com o valor 71, cairá no intervalo de 61 a 100 (Verde).
    io.to("monitoramento").emit('monitoramento_update', {
      ...cleanData,
      id: 'esp1'
    });
  }

  return reply.status(200).send({ status: "ok" });
});

app.register(UsersRoutes);
app.register(PostosRoutes);
app.register(StocksRoutes);
app.register(SavedPostosRoutes);
app.register(ProdutosRoutes);
app.register(ComunidadeRoutes);

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log("🚀 Servidor Unificado Online");
  } catch (err) {
    console.error("🔴 Erro:", err);
    process.exit(1);
  }
};

start();