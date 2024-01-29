import express from 'express';
import { createYoga } from 'graphql-yoga';
import { genSchema } from './utils/genSchema';
import Redis from 'ioredis';
import { User } from './entity/User';
import { createTypeormConn } from './utils/createTypeormConn';
import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
import path from 'path';

export  const redis = new Redis();

config({ path: path.resolve(__dirname, '../../.env') });

const secret: jwt.Secret = process.env.SECRET || "createaverystrongsec34!retthatalsoincludes2423412wdsa324e34e";

export function buildApp(app: ReturnType<typeof express>) {
  const graphQLServer = createYoga({
    schema: genSchema(),
    context: async ({ request }) => {
      const token = await request.headers.get('authentication')
      let user: any;
      try {
        user = await jwt.verify(token as string, secret)
      } catch (err) {
        console.error(`${err.message} caught`)
      }
      return { 
        redis,
        url: request.url,
        user,
        SECRET: secret
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