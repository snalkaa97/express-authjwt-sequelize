const express = require("express");
const route = express.Router();
const bankController = require("../api/bank");
const verifyJwtTokenController = require("../api").verifyJwtToken;

route.get(
	"/",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	bankController.getAll
);
route.post(
	"/",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	bankController.create
);

route.put(
	"/:id",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	bankController.update
);

route.delete(
	"/:id",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	bankController.delete
);

module.exports = route;
