const { validationResult } = require("express-validator");

const userHelper = require("../helpers/user-helper");

const signup = async (req, res, next) => {
  let returnObj;

  const errors = validationResult(req);

  const { name, email, password } = req.body;

  const userObj = { name, email, password };

  try {
    userHelper.checkValidation(userObj, errors);
    await userHelper.checkIfAlreadyExists(userObj);

    returnObj = await userHelper.signup(userObj);
  } catch (err) {
    return next(err);
  }

  res.status(201).json(returnObj);
};

const login = async (req, res, next) => {
  let returnObj;

  const errors = validationResult(req);

  const { email, password } = req.body;

  const userObj = { email, password };

  try {
    userHelper.checkValidation(userObj, errors, true);
    returnObj = await userHelper.login(userObj);
  } catch (err) {
    return next(err);
  }

  res.status(200).json(returnObj);
};

exports.signup = signup;
exports.login = login;
