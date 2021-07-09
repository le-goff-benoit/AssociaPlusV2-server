import { Member } from "./entities/Member";
import { __production__ } from "./technical/constants";
import { MikroORM } from "@mikro-orm/core";
import path from 'path'

export default {
migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
entities: [Member],
dbName: 'associaplus2',
user: '',
password: '',
type: 'postgresql',
debug: !__production__,
} as Parameters<typeof MikroORM.init>[0];