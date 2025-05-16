import "reflect-metadata";
import { AppDataSource } from "./dataSource";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import express from "express";
import { ApolloServer } from "apollo-server-express";

const PORT = process.env.PORT || 4000;

async function startServer() {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    const app = express();
    // Health check endpoint
    app.get("/health", (_req, res) => res.send("OK"));

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}/graphql`);
    });
}

startServer().catch((err) => {
    console.error("Failed to start server:", err);
});
