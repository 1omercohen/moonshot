import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { City } from "./entities/City";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "postgres",
    entities: [User, City],
    migrations: ["src/migrations/**/*.ts"],
    synchronize: false, // Always false in production – use migrations!
    logging: false,
});
