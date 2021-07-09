import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

export type MyContext = {
    orm: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
};