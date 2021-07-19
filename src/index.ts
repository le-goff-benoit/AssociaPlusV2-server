import { MikroORM } from "@mikro-orm/core";
import { __defaultport__, __production__ } from "./technical/constants";
import config from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MemberResolver } from "./resolvers/member";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./technical/types";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        secure: __production__,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      },
      saveUninitialized: false,
      name: "qid",
      secret: "benoit",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [MemberResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ orm: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(__defaultport__, () => {
    console.log("Express Server is running on port: " + __defaultport__);
  });
};

main().catch((error) => {
  console.log(error);
});
