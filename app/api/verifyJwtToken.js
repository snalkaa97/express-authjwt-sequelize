const jwt = require("jsonwebtoken");
const config = require("../config/configRoles.js");
const User = require("../models").User;
const Role = require("../models").Role;
const UserRole = require("../models").UserRole;
const db = require("../models");
const Op = db.Sequelize.Op;

module.exports = {
	verifyToken(req, res, next) {
		let tokenHeader = req.headers["authorization"];
		if (tokenHeader == undefined) {
			return res.status(500).send({
				auth: false,
				message: "Error",
				errors: "Token Invalid or Null",
			});
		}

		if (tokenHeader.split(" ")[0] !== "Bearer") {
			return res.status(500).send({
				auth: false,
				message: "Incorrect token format",
				errors: "Incorrect token format",
			});
		}

		let token = tokenHeader.split(" ")[1];

		if (!token) {
			return res.status(403).send({
				auth: false,
				message: "No token provided",
				errors: "No token provided",
			});
		}

		jwt.verify(token, config.secret, async (err, decoded) => {
			if (err) {
				return res.status(500).send({
					auth: false,
					message: err,
					errors: err,
				});
			}
			req.userId = parseInt(decoded.id);
			const user = await User.findOne({
				include: [
					{
						model: UserRole,
						attributes: ["role_id"],
						include: [
							{
								model: Role,
								attributes: ["name"],
							},
						],
					},
				],
				attributes: ["id", "name", "email", "password"],
				where: {
					id: decoded.id,
					email: decoded.email,
				},
			});
			if (!user) {
				return res.status(404).send({
					auth: false,
					message: "User not found!",
					errors: err,
				});
			}
			req.userId = parseInt(decoded.id);
			req.role = user.UserRoles;
			next();
		});
	},

	isAdmin(req, res, next) {
		return UserRole.findAll({
			include: [
				{
					model: Role,
					attributes: ["id", "name"],
					where: {
						name: "ADMIN",
					},
				},
			],
			where: {
				user_id: req.userId,
			},
		})
			.then((user) => {
				if (user.length <= 0) {
					res.status(500).send({
						auth: false,
						message: "Require Admin Role",
					});
					return;
				}
				next();
				return;
			})
			.catch((err) => {
				console.error(err);
			});
	},

	isAdminAndUser(req, res, next) {
		return UserRole.findAll({
			include: [
				{
					model: Role,
					attributes: ["id", "name"],
					where: {
						name: {
							[Op.in]: ["ADMIN", "USER"],
						},
					},
				},
			],
			where: {
				user_id: req.userId,
			},
		})
			.then((user) => {
				console.log(user);
				if (user.length <= 0) {
					res.status(403).send({
						auth: false,
						message: "Require Admin Role",
					});
					return;
				}
				next();
				return;
			})
			.catch((err) => {
				console.error(err);
			});
	},
};
