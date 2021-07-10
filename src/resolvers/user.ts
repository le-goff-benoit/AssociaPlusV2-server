import { User } from "../entities/User";
import { MyContext } from "src/technical/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { RegisterInput, LoginInput } from "../class/UserManagement";

@Resolver()
export class UserResolver {

    @Mutation(() => User)
    async register(
        @Arg('options') options: RegisterInput,
        @Ctx() { orm }: MyContext): Promise<User> {
            const hashedPassword = await argon2.hash(options.password);
            const user = await orm.create(User, {
                name: options.name,
                email: options.email,
                password: hashedPassword,
            })
            await orm.persistAndFlush(user);
            return user;
        }

    @Mutation(() => User)
    async login(
        @Arg('options') options: LoginInput,
        @Ctx() { orm }: MyContext): Promise<Boolean> {
            const user = orm.findOne(User, { email: options.email})
            if (user) {
                return true
            }
            return false
        }

    @Query(() => [User])
    async getUsers(
        @Ctx() { orm }: MyContext
    ): Promise<User[]> {
        const users = await orm.find(User, {})
        return users
    }

}