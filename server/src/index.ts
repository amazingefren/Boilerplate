// Environment Variables
import { __prod__ } from "./constants";
// Express
import express from "express";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
// Graph QL
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
// MikroORM + PostgreSQL
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
// API Resolvers
import { PostResolver } from "./resolvers/post-resolver";
import { UserResolver } from "./resolvers/user-resolver";
// Type Definitions
import { MyContext } from "./types";

const PORT = process.env.PORT || 4000; // Assign Port

const main = async () => {
  // MikroORM Configuration
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  // Express Init
  const app = express();

  // Redis Session
  let RedisStore = connectRedis(session);
  let redisClient = redis.createClient();

  // Redis Configuration
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, //10 years
        httpOnly: true,
        secure: __prod__, // true on prod -- cookie on HTTPS
      },
      saveUninitialized: false,
      secret: "dev",
      resave: false,
    })
  );

  // Apollo Configuration
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });
  apolloServer.applyMiddleware({ app });

  // Routing
  app.get("/", (_req, res) => {
    res.send("Hello");
  });

  // Server Start
  app.listen(PORT, () => {
    console.log("Server Started on Port: " + PORT);
  });
};

main().catch((err) => {
  console.error(err);
});
