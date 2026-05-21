import Fastify from "fastify";
import { Server } from "socket.io";
import cors from '@fastify/cors';
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';

import { env } from "./Env";
import { UsersRoutes } from "./http/controllers/users/routes";
import { PostosRoutes } from "./http/controllers/postos/routes";
import { StocksRoutes } from "./http/controllers/stock/routes";
import { SavedPostosRoutes } from "./http/controllers/saved-postos/routes";
import { Seed } from "./http/controllers/stock/seed";
import { main } from "prisma/seed";

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
main()


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
  socket.on("register", (userId) => socket.join(userId));
  socket.on("disconnect", () => console.log("❌ Cliente desconectado."));
});

// --- ROTA DOS SENSORES COM VALIDAÇÃO ANTI-CRASH ---
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

  io.emit('monitoramento_update', cleanData);

  return reply.status(200).send({ status: "ok" });
});

app.register(UsersRoutes);
app.register(PostosRoutes);
app.register(StocksRoutes);
app.register(SavedPostosRoutes);

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
