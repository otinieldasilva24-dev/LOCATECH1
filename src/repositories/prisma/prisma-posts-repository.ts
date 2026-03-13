import { Prisma, User, Posts } from "@prisma/client";
import { postssRepository } from "../posts-repository";
import { prisma } from "@/lib/prisma";
import { io } from "@/server";
import { normalizeBigInt } from "@/utills/begInt";
// import { sql } from 'prisma' 


export class PrismaPostsRepository implements postssRepository{
  
  async react(userId: number, postId:number, react:number){
          await prisma.react.create({
            data:{
                postsId:postId,
                react:react,
                userId:userId,
            }
          })
                       const posts = await prisma.posts.findMany({
    include: {
      users: {
        select: {
          nome: true,
          email: true,
          image_path: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  // Agora emite com o novo post incluído
  io.emit('posts', posts);

          return null
    }
   async delete(id: number){
        await prisma.posts.delete({
            where:{
                id
            }
        })
        return null
        }
        async Create(data: Prisma.PostsCreateInput){
            console.log(data)
            const post = await prisma.posts.create({
                data
            })
              const posts = await prisma.posts.findMany({
    include: {
      users: {
        select: {
          nome: true,
          email: true,
          image_path: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  io.emit('posts', posts);
  return post;

   
        }

    async fetchPosts(query: string|undefined){
    interface Posts{
        id: number;
        content: string;
        image_path: string | null;
        react: number;
        created_at: Date;
        userId: number;
    }[]
            if(!query){
                const posts = await prisma.posts.findMany({
                    include:{
                      
                        _count:true,
                        users:{
                            select:{
                                nome:true,
                                email:true,
                                image_path:true
                            }
                        },
                        Comment:{
                          include:{
                            users:{
                              select:{
                                  id:true,
                                  image_path:true,
                                  nome:true,
                                  email:true,
                                  phone:true,
                                  isAlive:true,
                                  created_at:true

                              }
                            }
                          },orderBy:{
                            created_at:'desc'
                          }
                        }
                    },orderBy:{
                        created_at:'desc'
                    }
                })
                
                return posts
                
            }      
const rawPosts = await prisma.$queryRawUnsafe<Posts[]>(`
  SELECT 
    p.id, 
    p.content,
    p.image_path,
    p.react,
    p.created_at,
    p."userId",

    -- Usuário
    json_build_object(
      'nome', u.nome,
      'email', u.email,
      'image_path', u.image_path
    ) AS users,

    -- Contagem de reações
    json_build_object(
      'React', (
        SELECT COUNT(*) FROM "React" r WHERE r."postsId" = p.id
      )
    ) AS "_count",

    -- Comentários agregados
    (
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'id', c.id,
            'content', c.content,
            'postsId', c."postsId"
          )
        ),
        '[]'
      )
      FROM "Comment" c
      WHERE c."postsId" = p.id
    ) AS comments,

    -- Rank full‑text
    ts_rank(
      to_tsvector('portuguese', p.content),
      plainto_tsquery('portuguese', $1)
    ) AS rank

  FROM "Posts" p
  JOIN "users" u ON u.id = p."userId"
  WHERE to_tsvector('portuguese', p.content) @@ plainto_tsquery('portuguese', $1)
  ORDER BY rank DESC
  LIMIT 10
`, query);


const posts = normalizeBigInt(rawPosts);
return posts
}
}