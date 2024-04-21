import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const Schema = mongoose.Schema;

export type UserDocument = Document & {
  email: string;
  password: string;
  baseCurrency: string;
};

type UserModel = Model<UserDocument> & {
  signup(email: string, password: string): Promise<UserDocument>;
  login(email: string, password: string): Promise<UserDocument | null>;
  changePassword(
    id: string,
    passwordOld: string,
    passwordNew: string
  ): Promise<UserDocument | null>;
  changeBaseCurrency(id: string, baseCurrency: string): Promise<UserDocument>;
};

const userSchema = new Schema<UserDocument, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  baseCurrency: {
    type: String,
    default: "CZK",
  },
});

userSchema.statics.signup = async function (
  email: string,
  password: string
): Promise<UserDocument> {
  if (!email || !password) throw Error("All fields must be filled.");
  if (!validator.isEmail(email)) throw Error("Email is not valid.");

  const exists = await this.findOne({ email });
  if (exists) throw Error("Email already in use.");

  if (!validator.isStrongPassword(password))
    throw Error(
      "Password should have a letter, a capital letter, a number, a special character and be at least 8 characters long."
    );

  const salt = await bcrypt.genSalt(15);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

userSchema.statics.login = async function (
  email: string,
  password: string
): Promise<UserDocument> {
  if (!email || !password) throw Error("All fields must be filled.");

  const user = await this.findOne({ email });

  if (!user) throw Error("Incorrect email.");

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw Error("Incorrect password.");

  return user;
};

userSchema.statics.changePassword = async function (
  id: string,
  passwordOld: string,
  passwordNew: string
) {
  if (!passwordOld || !passwordNew) throw Error("All fields must be filled.");

  const user = await this.findOne({ _id: id });
  const match = await bcrypt.compare(passwordOld, user!.password);
  if (!match) throw Error("Incorrect password.");

  if (!validator.isStrongPassword(passwordNew))
    throw Error(
      "Password should have a letter, a capital letter, a number, a special character and be at least 8 characters long."
    );

  const salt = await bcrypt.genSalt(15);
  const hash = await bcrypt.hash(passwordNew, salt);

  const updatedUser = await this.findOneAndUpdate(
    { _id: id },
    { password: hash }
  );

  if (!updatedUser)
    throw Error("Error while updating password, try again later.");

  return updatedUser;
};

userSchema.statics.changeBaseCurrency = async function (
  id: string,
  baseCurrency: string
) {
  if (!id) throw Error("Missing user ID.");
  if (!baseCurrency) throw Error("Missing base currency.");

  const updatedUser = await this.findOneAndUpdate(
    { _id: id },
    { baseCurrency }
  );

  if (!updatedUser)
    throw Error("Error while updating base currency, try again later.");

  return updatedUser;
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
