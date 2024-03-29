const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = require("../models").User;
const Role = require("../models").Role;
const UserRole = require("../models").UserRole;
const Op = db.Sequelize.Op;
const config = require("../config/configRoles");

module.exports = {
	async signup(req, res) {
		Role.findAll({
			where: {
				name: {
					[Op.in]: req.body.roles,
				},
			},
			attributes: ["id"],
		})
			.then((role) => {
				if (!role.length > 0) {
					console.log(role);
					return res.status(200).send({
						auth: false,
						id: req.body.id,
						message: "Role not found",
					});
				}
				// console.log(role.dataValues.id);
				return User.create({
					name: req.body.name,
					email: req.body.email,
					password: bcrypt.hashSync(req.body.password || "12345678", 8),
					// role_id: role.dataValues.id
				})
					.then(async (user) => {
						role.map((x) => {
							UserRole.create({
								user_id: user.id,
								role_id: x.id,
							});
						});
						var token =
							"Bearer " +
							jwt.sign(
								{
									id: user.id,
									email: user.email,
								},
								config.secret,
								{
									expiresIn: 86400, //24h expired
								}
							);
						const roles = await User.findOne({
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
							where: {
								email: req.body.email,
							},
							attributes: ["id", "name", "email", "password"],
						});
						console.log(roles);
						return res.status(200).send({
							auth: true,
							error: null,
							success: true,
							userToken: token,
							userInfo: {
								name: user.name,
								email: user.email,
								role: roles.UserRoles,
							},
							message: "User registered successfully.",
							error: null,
						});

						// })
					})
					.catch((err) => {
						res.status(500).send({
							auth: false,
							message: "Error",
							errors: err,
						});
					});
			})
			.catch((err) => {
				//    return res.status(500).send({
				//         auth: false,
				//         message: "Error",
				//         errors: err,
				//     })
				console.error(err);
			});
	},

	signin(req, res) {
		// console.log(req.body);
		return User.findOne({
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
			where: {
				email: req.body.email,
			},
			attributes: ["id", "name", "email", "password"],
		})
			.then((user) => {
				console.log(user);
				if (!user) {
					return res.status(404).send({
						auth: false,
						id: req.body.id,
						accessToken: null,
						userInfo: null,
						message: "User Not Found",
						errors: "User Not Found.",
					});
				}
				var passwordIsValid = bcrypt.compareSync(
					req.body.password,
					user.password
				);
				if (!passwordIsValid) {
					return res.status(500).send({
						auth: false,
						id: req.body.id,
						accessToken: null,
						userInfo: null,
						message: "Invalid Password!",
						errors: "Invalid Password!",
					});
				}
				console.log(user.email);
				var token =
					"Bearer " +
					jwt.sign(
						{
							id: user.id,
							email: user.email,
						},
						config.secret,
						{
							expiresIn: 86400, //24h expired
						}
					);

				console.log(token);

				res.status(200).send({
					auth: true,
					id: req.body.id,
					accessToken: token,
					userInfo: {
						name: user.name,
						email: user.email,
						role: user.UserRoles,
					},
					message: "Error",
					errors: null,
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send({
					auth: false,
					id: req.body.id,
					accessToken: null,
					message: "Error",
					errors: err,
				});
			});
	},
};
