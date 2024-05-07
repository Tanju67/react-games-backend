const express = require("express");
const router = express.Router();
const {
  register,
  login,
  createHighscore,
  getHighscore,
  getCurrentUser,
} = require("../controllers/userControllers");

const checkAuth = require("../middleware/auth");

router.post("/register", register);

router.post("/login", login);

router.use(checkAuth);

router.post("/highscore", createHighscore);

router.get("/highscore", getHighscore);

router.get("/current", getCurrentUser);

module.exports = router;
