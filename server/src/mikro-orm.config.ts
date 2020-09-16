import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrationsl
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files typescript + javascript
  },
  entities: [Post, User],
  dbName: "boilerplate",
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
