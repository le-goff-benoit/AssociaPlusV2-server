import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class User {

    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({default: 'NOW()'})
    createdAt: Date = new Date();

    @Field(() => String)
    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Field(() => String, {nullable: true})
    @Property()
    name?: string;

    @Field(() => String)
    @Property()
    email!: string;

    @Field(() => String)
    @Property()
    password!: string;

}