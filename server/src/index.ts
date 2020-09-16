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
const PORT = process.env.PORT || 4000;

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
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
