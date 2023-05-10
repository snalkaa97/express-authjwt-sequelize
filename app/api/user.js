const User = require("../models").User;
const bcrypt = require("bcryptjs");
const db = require("../models");
const Op = db.Sequelize.Op;
const UserRole = require("../models").UserRole;
const Role = require("../models").Role;
const jwt = require("jsonwebtoken");
const config = require("../config/configRoles.js");
const { paginates } = require("../helpers/index");

module.exports = {
	async getUsers(req, res) {
		console.log(req.query);
		let { page } = req.query;
		page = parseInt(page || 1);
		let { limit } = req.query;
		limit = parseInt(limit || 10);
		if (!req.query.name && !req.query.email && !req.query.roles) {
			const users = await User.paginate({
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
				page: page,
				paginate: limit,
				attributes: ["id", "name", "email"],
				order: [["id", "DESC"]],
			});
			const totalPage = Math.ceil(users.total / limit);
			let paginations = paginates({ current: page, max: totalPage });
			console.log(paginations);
			let pagination = {
				first_page_url: 1,
				from: users.total,
				page: page,
				items_per_page: limit,
				last_page: Math.ceil(users.total / limit),
				links: paginations,
			};
			return res.status(200).send({
				data: users.docs,
				currentPage: users.pages,
				totalPage: Math.ceil(users.total / limit),
				total: users.total,
				pagination,
			});
		} else {
			let where = {};
			let name = req.query.name ? { [Op.iLike]: `%${req.query.name}%` } : null;
			let email = req.query.email
				? { [Op.like]: `%${req.query.email}%` }
				: null;
			let role = req.query.roles ? { [Op.in]: req.query.roles } : null;
			name ? (where.name = name) : null;
			email ? (where.email = email) : null;
			const users = await User.paginate({
				include: [
					{
						model: UserRole,
						attributes: ["role_id"],
						include: [
							{
								model: Role,
								attributes: ["name"],
								where: {
									name: {
										[Op.in]: req.query.roles || ["ADMIN", "USER"],
									},
								},
							},
						],
					},
				],
				attributes: ["id", "name", "email"],
				page: page,
				paginate: limit,
				where: where,
				order: [["id", "DESC"]],
			});
			const totalPage = Math.ceil(users.total / limit);
			let paginations = paginates({ current: page, max: totalPage });
			let pagination = {
				first_page_url: 1,
				from: users.total,
				page: page,
				items_per_page: limit,
				last_page: Math.ceil(users.total / limit),
				links: paginations,
			};
			return res.status(200).send({
				data: users.docs,
				currentPage: users.pages,
				totalPage: Math.ceil(users.total / limit),
				total: users.total,
				pagination,
			});
		}
	},

	async changeEmail(req, res) {
		const email = req.body.email;
		const password = req.body.password;
		const id = req.userId;

		let user = await User.findByPk(id);
		if (!user) {
			return res.status(404).send({ message: "Email not found" });
		}

		var passwordIsValid = bcrypt.compareSync(password, user.password);
		if (!passwordIsValid) {
			return res.status(500).send({
				auth: false,
				accessToken: null,
				userInfo: null,
				message: "Invalid Password!",
				errors: "Invalid Password!",
			});
		}
		//cek email eksisting
		user = await User.findAll({
			where: {
				email: email,
				id: {
					[Op.not]: id,
				},
			},
		});

		if (user.length > 0) {
			return res.status(500).send({ message: "Email already in use" });
		}

		await User.update(
			{ email: email },
			{
				where: {
					id,
				},
			}
		)
			.then(async (response) => {
				console.log("Updated");
				console.log(email);
				user = await User.findOne({
					where: { email: email },
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
				return res.status(200).send({
					message: "Success",
					accesToken: token,
					userInfo: {
						email: email,
					},
				});
			})
			.catch((error) => {
				return res.status(500).send(error.message);
			});
	},

	async changeName(req, res) {
		const { name } = req.body;
		const id = req.userId;
		try {
			await User.update(
				{ name },
				{
					where: { id },
				}
			);
			console.log("Updated");
			return res.status(200).send({ message: "success" });
		} catch (err) {
			return res.status(500).send({ message: "Fail to update user" });
		}
	},

	async changePassword(req, res) {
		console.log(req.body);
		const { currentPassword, newPassword } = req.body;
		const id = req.userId;

		let user = await User.findByPk(id);
		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		var passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
		if (!passwordIsValid) {
			return res.status(500).send({
				auth: false,
				accessToken: null,
				userInfo: null,
				message: "Invalid Password!",
				errors: "Invalid Password!",
			});
		}

		try {
			user.update(
				{ password: bcrypt.hashSync(newPassword || "12345678", 8) },
				{
					where: { id },
				}
			);
			user = await User.findOne({
				where: { id },
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
			return res.status(200).send({ message: "success", accesToken: token });
		} catch (err) {
			return res.status(500).send({ message: "Failed to update password" });
		}
	},
	async updateUser(req, res) {
		const { id } = req.params;
		const { name, email } = req.body;
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).send({
				message: "user not found",
			});
		}
		await User.update(
			{ name: name, email: email },
			{
				where: {
					id: id,
				},
			}
		)
			.then(async () => {
				//delete role dahulu
				await UserRole.destroy({
					where: {
						user_id: id,
					},
				});
				const roles = await Role.findAll({
					where: {
						name: {
							[Op.in]: req.body.roles,
						},
					},
				});
				if (!roles.length > 0) {
					return res.status(404).send({
						message: "role not found",
					});
				}
				roles.map((role) => {
					UserRole.create({
						user_id: user.id,
						role_id: role.id,
					});
				});
				return res.status(200).send({
					data: user,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).send(err);
			});
	},

	async deleteUser(req, res) {
		const { id } = req.params;
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).send({
				message: "User not found",
			});
		}
		await User.destroy({
			where: {
				id: id,
			},
		})
			.then(() => {
				return res.status(200).send({
					data: user,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).send(err);
			});
	},
};
