import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MikroORM } from "@mikro-orm/core";
import { PostResolver } from "./resolvers/post-resolver";
import { UserResolver } from "./resolvers/user-resolver";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
// import { CLIConfigurator } from "@mikro-orm/cli";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const PORT = process.env.PORT || 4000;

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const app = express();

  let RedisStore = connectRedis(session);
  let redisClient = redis.createClient();

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_req, res) => {
    res.send("Hello");
  });

  app.listen(PORT, () => {
    console.log("Server Started on Port: " + PORT);
  });
  // const post = orm.em.create(Post, { title: "My Sample Post" });
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
