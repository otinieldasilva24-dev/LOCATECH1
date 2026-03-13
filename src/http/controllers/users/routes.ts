import { FastifyInstance } from "fastify";
import { Register } from "./Register";
import { Authenticate } from "./authenticate";
import { Profile } from "./Perfil";
import { refresh } from "./refresh";
import { FetchUsers } from "./fetch-users";
import { verifyJWT } from "../middleware/verify-jwt";
import { DeleteClients } from "./delete";
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { upload } from "@/utills/multer";



export async function  UsersRoutes(app:FastifyInstance) {

  app.post('/users', async (request, reply) => {
    await new Promise<void>((resolve, reject) => {
      const uploadMiddleware = upload.single('image')
      uploadMiddleware(request.raw as any, reply.raw as any, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })

    // Copia as propriedades para o objeto Fastify
    request.body = (request.raw as any).body
    ;(request as any).file = (request.raw as any).file

    return Register(request, reply)
  })


    app.post('/sessions',Authenticate)
    app.delete('/delete', DeleteClients)
    app.patch('/token/refresh',refresh)
    app.get('/me',{onRequest : [verifyJWT] } ,Profile)
    app.get('/fetch-users',FetchUsers)  
}