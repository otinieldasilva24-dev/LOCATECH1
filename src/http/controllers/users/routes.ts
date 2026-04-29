import { FastifyInstance } from "fastify";
import { Register } from "./Register";
import { Authenticate } from "./authenticate";
import { Profile } from "./Perfil";
import { refresh } from "./refresh"
import { verifyJWT } from "../middleware/verify-jwt";
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { upload } from "@/utills/multer";
import { avatarRoutes } from "./avatar-controller";



export async function  UsersRoutes(app:FastifyInstance) {
    app.post('/users', async (request, reply) => {
   await new Promise<void>((resolve, reject) => {
     upload.single('image')(request.raw as any, reply.raw as any, (err) => {
       if (err) return reject(err)
       resolve()
     })
   })

   // ← TEM DE TER ISTO
   request.body = (request.raw as any).body;
   ;(request as any).file = (request.raw as any).file

   return Register(request, reply)
 })

    app.post('/sessions',Authenticate)
    app.patch('/token/refresh',refresh)
    app.get('/me',{onRequest : [verifyJWT] } ,Profile)

    // Upload de avatar
    avatarRoutes(app)
}
