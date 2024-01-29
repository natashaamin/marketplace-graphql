import express from 'express';
import { createYoga } from 'graphql-yoga';
import { genSchema } from './utils/genSchema';
import Redis from 'ioredis';
import { User } from './entity/User';
import { createTypeormConn } from './utils/createTypeormConn';

export  const redis = new Redis();

export function buildApp(app: ReturnType<typeof express>) {
  const graphQLServer = createYoga({
    schema: genSchema(),
    context: async ({ request }) => {
      return { 
        redis,
        url: request.url
      }
    }  
  })

  app.get("/confirm/:id",async (req: any, res: any) => {
    const {id} = req.params;
    const userId = await redis.get(id);
    if(userId) {
      await User.update({ id: userId as string }, { confirmed: true});
      res.send("ok")  
    } else {
      res.send("invalid")  
    }
  })

  app.use(graphQLServer.graphqlEndpoint, graphQLServer);

  createTypeormConn();

  return graphQLServer.graphqlEndpoint;
}