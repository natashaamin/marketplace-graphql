import { DataSource } from "typeorm";

export const createTypeormConn = async () => {
    const dataSource = new DataSource({
        type: "postgres",
        host: "localhost", // change this to ur intended host
        port: 5432,
        username: "postgres", // change this to ur intended username
        password: "Honey143!", // change this to ur intended password
        database: "graphql-marketplace", // change this to ur intended database
        synchronize: true,
        logging: true,
        entities: ["src/entity/**/*.ts"],
        migrations: ["src/migration/**/*.ts"],
        subscribers: ["src/subscriber/**/*.ts"],
        name: process.env.NODE_ENV === "default" ? "default" : `default-${process.env.NODE_ENV}`,
    });

    return dataSource.initialize();
};
