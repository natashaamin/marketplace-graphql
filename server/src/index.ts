import { AppDataSource } from "./data-source"
import * as dotenv from 'dotenv';
import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { resolvers } from './resolvers';
import * as path from 'path';
import { importSchema } from 'graphql-import';

dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 9000;

const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers
  })
})

const server = createServer(yoga)

AppDataSource.initialize().then(async () => {
  server.listen(PORT, () => {
    console.info(`Server is running on http://localhost:${PORT}/graphql`)
  })
})