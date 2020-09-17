// Lib Imports
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

// Entity Imports
import { User } from "../entities/User";

// Type Declaration
import { MyContext } from "./../types";

// User Creation Input Type
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

// User Creation Error Type
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

// User Response Type
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // Returns users information based on cookie
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session!.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session!.userId });
    return user;
  }

  // User Registration
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    // User Registration Username Verification
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Length Must be greater than 2",
          },
        ],
      };
    }
    // User Registration Password Verification
    if (options.password.length <= 3) {
      return {
        errors: [{ field: "password", message: "Password too short" }],
      };
    }

    // Hash Password and Create User
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    // Create User and Store in DB
    try {
      await em.persistAndFlush(user); // MikroORM lifecycle hook limitation will trigger em.persist () from being called on hooks. TODO: Find Alternate Solution, this will do for now
    } catch (err) {
      // 23505 Username not Unique (Username already in use)
      if (err.code == "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }
    }

    // Sets user cookie on browser after registration succeeds
    req.session!.userId = user.id;
    return { user };
  }

  // User Login
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    // Check if Username is valid
    const user = await em.findOne(User, {
      username: options.username.toLowerCase(),
    });
    // Return error if username does not exist
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }

    // Validate Plain Password to Hashed Password
    const valid = await argon2.verify(user.password, options.password);

    // Return error is password is incorrect
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    // Assign Browser Cookie
    req.session!.userId = user.id;
    return {
      user,
    };
  }
}
