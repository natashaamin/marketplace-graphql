import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost", // change this to ur intended host
    port: 5432,
    username: "postgres", // change this to ur intended username
    password: "Honey143!", // change this to ur intended password
    database: "graphql-marketplace", // change this to ur intended database
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
})
