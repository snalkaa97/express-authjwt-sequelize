require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./app/models");
const logger = require("morgan");

const app = express();

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
	res.header("Access-Control-Allow-Origin", "*");
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
	app.listen(5555, () => console.log("Server running at port 5555"));
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

	db.Role.create({
		id: 3,
		name: "PM",
	});
}
