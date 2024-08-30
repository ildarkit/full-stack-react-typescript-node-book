import {User} from './User';
import bcrypt from 'bcryptjs';
import {isPasswordValid} from '../common/validators/PasswordValidator';
import {isEmailValid} from '../common/validators/EmailValidator';

const saltRounds = 10;

export class UserResult {
  constructor(
    public messages?: Array<string>,
    public user?: User
  ) {}
}

export const register = async (
  email: string,
  userName: string,
  password: string
): Promise<UserResult> => {
  const result = isPasswordValid(password);
  if (!result.isValid) {
    return {
      messages: [
        "Passwords must have min lenght 8, 1 upper character, 1 number, and 1 symbol",
      ],
    };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailErrorMsg = isEmailValid(trimmedEmail);
  if (emailErrorMsg)
    return {
      messages: [emailErrorMsg]
    };

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userEntity = await User.create({
    email: trimmedEmail,
    userName,
    password: hashedPassword,
  }).save();

  userEntity.password = "";
  return {user: userEntity};
};
