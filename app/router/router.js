const verifySignUpController = require("../api").verifySignUp;
const verifySignController = require("../api").verifySign;
const verifyJwtTokenController = require("../api").verifyJwtToken;

const userRoute = require("./user");
const bankRoute = require("./bank");

module.exports = function (app) {
	app.post(
		"/api/auth/signup",
		[
			verifySignUpController.checkDuplicateUserNameOrEmail,
			verifySignUpController.checkRolesExisted,
		],
		verifySignController.signup
	);
	app.post("/api/auth/signin", verifySignController.signin);

	app.post(
		"/api/auth/verifyToken",
		[verifyJwtTokenController.verifyToken],
		(req, res) => {
			res.status(200).send({ verifyToken: true, role: req.role });
		}
	);

	//user
	app.use("/api/user", userRoute);

	//bank
	app.use("/api/bank", bankRoute);
};
