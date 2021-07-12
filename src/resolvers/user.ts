import { User } from "../entities/User";
import { MyContext } from "src/technical/types";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import { RegisterInput, LoginInput, UserResponse } from "../class/UserManagement";

@Resolver()
export class UserResolver {

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: RegisterInput,
        @Ctx() { orm }: MyContext): Promise<UserResponse> {
            const alreadyExistEmail = await orm.findOne(User, {email: options.email})
            if (alreadyExistEmail != null) {
                return {
                    errors: [{
                        message: "Email already registered",
                        field: "email"
                    }]
                };
            }  
            if (options.password.length < 5) {
                return {
                    errors: [{
                        message: "Password's length must be greater than 5",
                        field: "password"
                    }]
                };
            }  
            const hashedPassword = await argon2.hash(options.password);
            const userToCreate = await orm.create(User, {
                name: options.name,
                email: options.email,
                password: hashedPassword,
            })
            await orm.persistAndFlush(userToCreate);
            return {
                user: userToCreate
            }
        }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: LoginInput,
        @Ctx() { orm }: MyContext): Promise<UserResponse> {
            const userConnecting = await orm.findOne(User, { email: options.email})     
            if (!userConnecting) {
                return {
                    errors: [{
                        message: "User doesn't exist",
                        field: "email"
                    }]
                };
            }  
            const valid = await argon2.verify(userConnecting.password,options.password)
            if (!valid) {
                return {
                    errors: [{
                        message: "Password is not correct",
                        field: "password"
                    }]
                };
            } 
            return {
                user: userConnecting
            }     
        }

}