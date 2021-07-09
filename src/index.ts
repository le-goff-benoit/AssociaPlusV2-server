import { MikroORM } from "@mikro-orm/core";
import { __defaultport__, __production__ } from "./technical/constants";
import config from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MemberResolver } from "./resolvers/member";

const main = async () => {
    const orm = await MikroORM.init(config);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [MemberResolver],
            validate: false,
        }),
        context: () => ({ orm: orm.em })
    });

    apolloServer.applyMiddleware({ app })

    app.listen(__defaultport__, () => {
        console.log('Express Server is running on port: ' + __defaultport__)
    })
}

main().catch((error) => {
    console.log(error);
});