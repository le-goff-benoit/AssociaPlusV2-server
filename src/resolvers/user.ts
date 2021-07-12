import { User } from "../entities/User";
import { MyContext } from "src/technical/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import {
  RegisterInput,
  LoginInput,
  UserResponse,
} from "../class/UserManagement";

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { orm, req }: MyContext): Promise<User | any> {
    if (!req.session.userId) {
      return null;
    }

    const userLoggedIn = await orm.findOne(User, { id: req.session.userId });
    return userLoggedIn;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { orm, req }: MyContext
  ): Promise<UserResponse> {
    const alreadyExistEmail = await orm.findOne(User, { email: options.email });
    if (req.session.userId) {
      return {
        errors: [
          {
            message: "Already logged in",
            field: "email",
          },
        ],
      };
    }
    if (alreadyExistEmail != null) {
      return {
        errors: [
          {
            message: "Email already registered",
            field: "email",
          },
        ],
      };
    }
    if (options.password.length < 5) {
      return {
        errors: [
          {
            message: "Password's length must be greater than 5",
            field: "password",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const userToCreate = await orm.create(User, {
      name: options.name,
      email: options.email,
      password: hashedPassword,
    });
    await orm.persistAndFlush(userToCreate);
    req.session.userId = userToCreate.id;
    return {
      user: userToCreate,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { orm, req }: MyContext
  ): Promise<UserResponse> {
    const userConnecting = await orm.findOne(User, { email: options.email });
    if (!userConnecting) {
      return {
        errors: [
          {
            message: "User doesn't exist",
            field: "email",
          },
        ],
      };
    }
    const valid = await argon2.verify(
      userConnecting.password,
      options.password
    );
    if (!valid) {
      return {
        errors: [
          {
            message: "Password is not correct",
            field: "password",
          },
        ],
      };
    }

    req.session.userId = userConnecting.id;

    return {
      user: userConnecting,
    };
  }
}
