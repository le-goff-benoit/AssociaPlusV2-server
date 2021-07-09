import { MikroORM } from "@mikro-orm/core";
import { Member } from "./entities/Member";
import { __production__ } from "./technical/constants";
import config from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(config)

    const member = orm.em.create(Member, {name: 'Benoît Le Goff'});
    await orm.em.persistAndFlush(member);
}

main().catch((error) => {
    console.log(error);
}); 