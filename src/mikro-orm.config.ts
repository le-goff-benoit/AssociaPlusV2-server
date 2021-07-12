import { __production__ } from "./technical/constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { Member } from "./entities/Member";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Member, User],
  dbName: "associaplus2",
  user: "",
  password: "",
  type: "postgresql",
  debug: !__production__,
} as Parameters<typeof MikroORM.init>[0];
