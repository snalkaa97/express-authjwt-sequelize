require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./app/models");
const logger = require("morgan");

const app = express();

app.use(
	cors({
		origin: function (origin, callback) {
			return callback(null, true);
		},
		optionsSuccessStatus: 200,
		credentials: true,
	})
);
app.use(logger("dev"));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(cookieParser());
app.use(express.static("app/public"));

//Set app config
const title = process.env.TITLE;
const port = process.env.PORT;
const baseUrl = process.env.URL + port;

app.use((req, res, next) => {
	// res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

require("./app/router/router.js")(app);

db.sequelize.sync().then(() => {
	app.listen(port, () => console.log(`Server running at port ${port}`));
	// create_roles();
});

function create_roles() {
	db.Role.create({
		id: 1,
		name: "USER",
	});

	db.Role.create({
		id: 2,
		name: "ADMIN",
	});
}
