const verifySignUpController = require("../api").verifySignUp;
const verifySignController = require("../api").verifySign;
const verifyJwtTokenController = require("../api").verifyJwtToken;

const pegawaiRoute = require("./pegawai");
const postRoute = require("./post");
const userRoute = require("./user");

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

	app.post("/api/auth/verifyToken", [verifyJwtTokenController.verifyToken], (req,res) => {
		res.status(200).send({verifyToken:true})
	})

	//user
	app.use("/api/user", userRoute);

	//pegawai
	app.use("/api/pegawai", pegawaiRoute);

	//posts
	app.use("/api/post", postRoute);
};
