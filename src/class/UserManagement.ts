import { User } from "../entities/User";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class RegisterInput {
    @Field(() => String, {nullable: true})
    name?: string

    @Field()
    email: string

    @Field()
    password: string
}

@InputType()
export class LoginInput {
    @Field()
    email: string

    @Field()
    password: string
}

@ObjectType()
export class UserError {
    @Field(() => String)
    message: string;

    @Field(() => String)
    field: string;
}

@ObjectType()
export class UserResponse {
    @Field(() => [UserError], {nullable: true})
    errors?: UserError[]

    @Field(() => User, { nullable: true})
    user?: User
}