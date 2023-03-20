const express = require("express");
const route = express.Router();
const userController = require("../api/user");
const verifyJwtTokenController = require("../api").verifyJwtToken;

route.get(
	"/",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	userController.getUsers
);


module.exports = route;