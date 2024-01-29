import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import { formatYupError } from "../../utils/formatYupError";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import { invalidPassword, invalidUser } from "./errorMessages";

export const resolvers: ResolverMap = {
    Mutation: {
        login: async (_, args: GQL.ILoginOnMutationArguments, { SECRET }) => {
            try {
                const { username, password } = args;

                const user = await User.findOne({
                    where: { username },
                })

                if (!user) {
                    return {
                        success: false,
                        errors: [{
                            path: "username",
                            message: invalidUser
                        }]
                    }
                }

                const isValid = await bcrypt.compare(password, user.password);

                if (!isValid) {
                    return {
                        success: false,
                        errors: [{
                            path: "password",
                            message: invalidPassword
                        }]
                    }
                }

                // sign in the user
                // create the token specifically for the user and return the token
                // you can specify how long the token will take to expire, this is up to you
                const token = await jwt.sign(
                    {
                        user: pick(user.id, ['id', 'username']),
                    },
                    SECRET,
                    // this token will last for a year, this should be adjusted accordingly
                    { expiresIn: '1d' }
                )

                return {
                    success: true,
                    token: token,
                    errors: null 
                }
            } catch (error) {
                return formatYupError(error)
            }
        }
    }
}