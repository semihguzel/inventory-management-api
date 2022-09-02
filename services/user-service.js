const User = require("../models/user");

const HttpError = require("../utils/HttpError");

const signup = async (userObj) => {
  const user = new User({
    name: userObj.name,
    email: userObj.email,
    password: userObj.password,
  });

  try {
    await user.save();
  } catch (err) {
    throw new HttpError("Signing up failed, please try again", 500);
  }

  return user.id;
};

const doesUserExists = async (userObj) => {
  try {
    return await User.exists(userObj);
  } catch (err) {
    throw new HttpError(
      "There has been an error when signing up, please try again.",
      500
    );
  }
};

const getByEmail = async (email) => {
  let user;
  try {
    user = await User.findOne({ email });

    if (!user)
      throw new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500
      );
  } catch (err) {
    throw new HttpError(
      "There has been an error when logging in, please try again.",
      500
    );
  }

  return user;
};

exports.doesUserExists = doesUserExists;
exports.signup = signup;
exports.getByEmail = getByEmail;
