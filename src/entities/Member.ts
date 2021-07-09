import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Member {

    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({default: 'NOW()'})
    createdAt: Date = new Date();

    @Field(() => String)
    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Field(() => String)
    @Property()
    name!: string;

}