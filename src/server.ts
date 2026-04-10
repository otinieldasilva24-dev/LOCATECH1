import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Server } from "socket.io";
import { UsersRoutes } from "./http/controllers/users/routes";
import { env } from "./Env";
import cors  from'@fastify/cors'
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import multipart from '@fastify/multipart'
import path from 'path'
import fastifyStatic from '@fastify/static'
import { PostosRoutes } from "./http/controllers/postos/routes";
import { StocksRoutes } from "./http/controllers/stock/routes";
import { prisma } from "./lib/prisma";
import { Seed } from "./http/controllers/stock/seed";




const app = Fastify();
const server = app.server;

// Configurações essenciais
app.register(multipart);
// app.register(fastifyStatic, {
//   root: path.join(__dirname, "./http/controllers/uploads"),
//   prefix: "/uploads/",
// });local

app.register(fastifyStatic, {
  root: path.join(__dirname,"uploads"),
  prefix: "/uploads/",
});




// Segurança e Autenticação
  app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: { expiresIn: '10m' }
});


app.register(fastifyCookie);
Seed()
// CORS Aprimorado
app.register(cors, {
  origin: [
    'https://quintal.onrender.com',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  exposedHeaders: ['Authorization']
});

app.addContentTypeParser(
  "multipart/form-data",
  (_request, _payload, done) => done(null)
);
 
export const io = new Server(server, {
  cors: {
    origin: [
      // 'https://quintal.onrender.com',
      'http://localhost:5000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.post('/sensor', async (request, reply) => {
  const { userId, content } = request.body;
    // Lógica para salvar no banco (Prisma/PostgreSQL)
    console.log("Recebido:", request.body);
    
})

// Rotas
app.register(UsersRoutes);
app.register(PostosRoutes);

app.register(StocksRoutes)


// Socket Events
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  socket.on("register", (userId) => {
    socket.join(userId);
  });
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Inicialização
const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: '0.0.0.0'
    });
    console.log("Servidor rodando 🐱‍🏍");
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
};

start();