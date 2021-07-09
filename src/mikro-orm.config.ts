import { Member } from "./entities/Member";
import { __production__ } from "./technical/constants";
import { MikroORM } from "@mikro-orm/core";

export default {
entities: [Member],
dbName: 'associaplus2',
user: '',
password: '',
type: 'postgresql',
debug: !__production__,
} as Parameters<typeof MikroORM.init>[0];