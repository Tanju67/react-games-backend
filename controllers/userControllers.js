const UserModel = require("../models/userModel");
const GameModel = require("../models/gameModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await UserModel.create({ name, email, password });
  const { password: pass, ...info } = user;
  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      name: user.name,
      token,
    },
  });
};

const getCurrentUser = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.userData.userId });
  res.status(StatusCodes.OK).json({ name: user.name });
};

const createHighscore = async (req, res) => {
  const { highscore } = req.body;
  console.log(highscore);
  const createdBy = req.userData.userId;

  let score = await GameModel.findOne({ createdBy });

  if (!score) {
    score = await GameModel.create({ highscore, createdBy });
    res.status(StatusCodes.CREATED).json({ score });
  } else {
    score.highscore = highscore;
    await score.save();
    res.status(StatusCodes.OK).json({ score });
  }
};

const getHighscore = async (req, res) => {
  const createdBy = req.userData.userId;

  let score = await GameModel.findOne({ createdBy });

  res.status(StatusCodes.OK).json({ score });
};

module.exports = {
  register,
  login,
  createHighscore,
  getHighscore,
  getCurrentUser,
};
