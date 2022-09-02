const userService = require("../services/user-service");
const HttpError = require("../utils/HttpError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateInput = (userObj, isLoggingIn) => {
  if (
    userObj.email &&
    userObj.email.length > 0 &&
    userObj.password &&
    userObj.password.length > 0
  ) {
    if (isLoggingIn || (!isLoggingIn && userObj.name && userObj.email.name > 0))
      return true;
  }
  return false;
};

const checkValidation = (userObj, errors, isLoggingIn = false) => {
  if (!errors.isEmpty() || !validateInput(userObj, isLoggingIn))
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
};

const checkIfAlreadyExists = async (userObj) => {
  try {
    const doesExists = await userService.doesUserExists(userObj);

    if (doesExists)
      throw new HttpError(
        "User already exists, please login with your credentials.",
        422
      );
  } catch (err) {
    throw err;
  }
};

const hashPassword = async (password) => {
  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.PASSWORD_SALT_LENGTH)
    );
  } catch (err) {
    throw new HttpError(
      "There has been an error when signing up, please try again.",
      500
    );
  }

  return hashedPassword;
};

const signToken = (userId, email) => {
  let token;
  try {
    token = jwt.sign(
      {
        userId,
        email,
      },
      process.env.JWT_SALT,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    throw new HttpError("Signing up failed, please try again", 500);
  }

  return token;
};

const checkPasswordValidity = async (requestPassword, userPassword) => {
  try {
    const isValidPassword = await bcrypt.compare(requestPassword, userPassword);

    if (!isValidPassword) throw new HttpError("Invalid credentials", 403);
  } catch (err) {
    throw new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
  }
};

const signup = async (userObj) => {
  let token;
  let userId;
  try {
    userObj.password = await hashPassword(userObj.password);

    userId = await userService.signup(userObj);

    token = signToken(userId, userObj.email);
  } catch (err) {
    throw err;
  }

  return { userId, email: userObj.email, token };
};

const login = async (userObj) => {
  let user;
  let token;
  try {
    user = await userService.getByEmail(userObj.email);
    await checkPasswordValidity(userObj.password, user.password);
    token = await signToken(user.id, user.email);
  } catch (err) {
    throw err;
  }

  return { userId: user.id, email: user.email, token };
};

exports.checkIfAlreadyExists = checkIfAlreadyExists;
exports.signup = signup;
exports.validateInput = validateInput;
exports.checkValidation = checkValidation;
exports.checkPasswordValidity = checkPasswordValidity;
exports.login = login;
