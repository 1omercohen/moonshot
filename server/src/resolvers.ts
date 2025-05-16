import { AppDataSource } from "./dataSource";
import { User } from "./entities/User";
import { City } from "./entities/City";
import { validate, IsNotEmpty, IsDateString } from "class-validator";
import { UserInputError, ApolloError } from "apollo-server-express";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Class-validator DTO for input
export class CreateUserInput {
    @IsNotEmpty()
    firstName!: string;

    @IsNotEmpty()
    lastName!: string;

    @IsNotEmpty()
    @IsDateString()
    birthDate!: string;

    @IsNotEmpty()
    city!: string;
}

export const resolvers = {
    Query: {
        getUsers: async () => {
            const userRepo = AppDataSource.getRepository(User);
            const users = await userRepo.find();
            console.log(users);
            return users;
        },
    },
    Mutation: {
        createUser: async (_parent: any, args: { input: CreateUserInput }) => {
            const input = Object.assign(new CreateUserInput(), args.input);
            const errors = await validate(input);
            if (errors.length > 0) {
                const messages = errors
                    .map((e) => Object.values(e.constraints!).join(", "))
                    .join("; ");
                throw new UserInputError(
                    `Input validation failed: ${messages}`
                );
            }
            // Find the city entity by name
            const cityRepo = AppDataSource.getRepository(City);
            const city = await cityRepo.findOneBy({ name: input.city });
            if (!city) {
                throw new UserInputError(
                    `City '${input.city}' is not a valid option`
                );
            }
            // Create and save new user
            const userRepo = AppDataSource.getRepository(User);
            const user = userRepo.create({
                firstName: input.firstName,
                lastName: input.lastName,
                birthDate: new Date(input.birthDate),
                city: city,
            });
            await userRepo.save(user);
            return user;
        },
        updateUser: async (
            _parent: any,
            args: { id: string; input: CreateUserInput }
        ) => {
            const id = parseInt(args.id);
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({
                where: { id },
                relations: ["city"],
            });
            if (!user) {
                throw new ApolloError(
                    `User with id ${args.id} not found`,
                    "NOT_FOUND"
                );
            }
            // Validate input
            const input = Object.assign(new CreateUserInput(), args.input);
            const errors = await validate(input);
            if (errors.length > 0) {
                const messages = errors
                    .map((e) => Object.values(e.constraints!).join(", "))
                    .join("; ");
                throw new UserInputError(
                    `Input validation failed: ${messages}`
                );
            }
            const cityRepo = AppDataSource.getRepository(City);
            const city = await cityRepo.findOneBy({ name: input.city });
            if (!city) {
                throw new UserInputError(
                    `City '${input.city}' is not a valid option`
                );
            }
            // Update and save user
            user.firstName = input.firstName;
            user.lastName = input.lastName;
            user.birthDate = new Date(input.birthDate);
            user.city = city;
            await userRepo.save(user);
            return user;
        },
        deleteUser: async (_parent: any, args: { id: string }) => {
            const id = parseInt(args.id);
            const userRepo = AppDataSource.getRepository(User);
            const result = await userRepo.delete(id);
            return result.affected ? result.affected > 0 : false;
        },
    },
    User: {
        city: (parent: User) => parent.city.name,
        birthDate: (parent: User) => parent.birthDate.toISOString(),
        createdAt: (parent: User) => parent.createdAt.toISOString(),
        updatedAt: (parent: User) => parent.updatedAt.toISOString(),
    },
    CityEnum: {
        TEL_AVIV: "TEL AVIV",
        NEW_YORK: "NEW YORK",
        LONDON: "LONDON",
        PARIS: "PARIS",
        TOKYO: "TOKYO",
    },
};
