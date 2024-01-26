import { User } from "./entity/User";
import { ResolverMap } from "./types/graphql-utils";
import { GQL } from "./types/schema";
import * as bcrypt from 'bcrypt';

export const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Bye ${name || "World"}`
  },
  Mutation: {
    register: async (_, { username, password }: GQL.IRegisterOnMutationArguments) => {
      // take password and hash it
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        password: hashedPassword
      });
      await user.save();
      return true
    }
  }
};