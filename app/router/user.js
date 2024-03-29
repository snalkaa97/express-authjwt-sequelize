const express = require("express");
const route = express.Router();
const userController = require("../api/user");
const verifyJwtTokenController = require("../api").verifyJwtToken;

route.get(
	"/",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	userController.getUsers
);

route.put(
	"/:id",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	userController.updateUser
);

route.delete(
	"/:id",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	userController.deleteUser
);

route.put(
	"/changeEmail",
	[verifyJwtTokenController.verifyToken],
	userController.changeEmail
);

route.put(
	"/changeName",
	[verifyJwtTokenController.verifyToken],
	userController.changeName
);

route.put(
	"/changePassword",
	[verifyJwtTokenController.verifyToken],
	userController.changePassword
);

module.exports = route;
