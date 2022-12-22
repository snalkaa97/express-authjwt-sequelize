const verifySignUpController = require("../api").verifySignUp;
const verifySignController = require("../api").verifySign;
const verifyJwtTokenController = require("../api").verifyJwtToken;

const pegawaiRoute = require("./pegawai");
const postRoute = require("./post");

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

	//pegawai
	app.use("/api/pegawai", pegawaiRoute);

	//posts
	app.use("/api/post", postRoute);
};
