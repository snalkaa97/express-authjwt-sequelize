const express = require("express");
const route = express.Router();
const postController = require("../api/post");
const verifyJwtTokenController = require("../api").verifyJwtToken;

route.get(
	"/",
	[
		verifyJwtTokenController.verifyToken,
		verifyJwtTokenController.isAdminAndUser
	],
	postController.list
);

route.post(
	"/",
	[
		verifyJwtTokenController.verifyToken,
		verifyJwtTokenController.isAdmin
	],
	postController.add
);

route.put(
	"/:id",
	[
        verifyJwtTokenController.verifyToken,
		verifyJwtTokenController.isAdmin,
	],
	postController.update
);

route.delete(
	"/:id",
	[
        verifyJwtTokenController.verifyToken,
		verifyJwtTokenController.isAdmin,
	],
	postController.delete
);
// route.put(
// 	"/:id",
// 	[
// 		verifyJwtTokenController.verifyToken,
// 		// verifyJwtTokenController.isAdmin
// 	],
// 	postController.update
// );

// route.delete(
// 	"/:id",
// 	[
// 		verifyJwtTokenController.verifyToken,
// 		// verifyJwtTokenController.isAdmin
// 	],
// 	postController.delete
// );

module.exports = route;
