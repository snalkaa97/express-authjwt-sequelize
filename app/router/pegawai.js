const express = require("express");
const route = express.Router();
const pegawaiController = require("../api").pegawai;
const verifyJwtTokenController = require("../api").verifyJwtToken;

route.get(
	"/",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	pegawaiController.list
);

route.get(
	"/:id",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	pegawaiController.getById
);

route.post(
	"/",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	pegawaiController.add
);

route.put(
	"/:id",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	pegawaiController.update
);

route.delete(
	"/:id",
	[verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
	pegawaiController.delete
);

module.exports = route;
