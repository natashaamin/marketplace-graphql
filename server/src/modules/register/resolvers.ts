import * as bcrypt from 'bcrypt';
import * as yup from 'yup';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { duplicateEmail, emailNotLongEnough, invalidEmail } from './errorMessages';
import { registerPasswordValidation } from '../../../yupSchemas';
import { formatYupError } from '../../utils/formatYupError';
import { GQL } from '../../types/schema';
// import { createConfirmEmailLink } from './createConfirmEmailLink';

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail),
  password: registerPasswordValidation
})

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments) => {
      try {
        await schema.validate(args, { abortEarly: false });

        const { username, password } = args;

        const userAlreadyExist = await User.findOne({
          where: { username },
          select: ["id"]
        })

        if (userAlreadyExist) {
          return {
            success: false,
            errors: [{
              path: "username",
              message: duplicateEmail
            }]
          }
        }
        // take password and hash it
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          username,
          password: hashedPassword
        });

        await user.save();
        // const link = await createConfirmEmailLink(url, user.id, redis);
        return { success: true, errors: null };

      } catch (err) {
        return formatYupError(err);
      }

    }
  }
};