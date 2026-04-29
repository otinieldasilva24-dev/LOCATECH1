import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request:FastifyRequest,reply:FastifyReply){
    try{
        await request.jwtVerify()
    }catch{
        return reply.status(401).send({message :'unauthorized'})
    }
}

// Verifica se o usuário tem pelo menos uma das roles permitidas
export function verifyUserRole(allowedRoles: ('ADMIN'|'MEMBER'|'GESTOR')[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const userRole = request.user?.role
        
        if (!userRole || !allowedRoles.includes(userRole)) {
            return reply.status(403).send({ 
                message: 'Acesso negado. Permissão insuficiente.' 
            })
        }
    }
}