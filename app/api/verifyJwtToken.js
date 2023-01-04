const jwt = require("jsonwebtoken");
const config = require("../config/configRoles.js");
const User = require("../models").User;
const Role = require("../models").Role;
const UserRole = require("../models").UserRole;
const db = require("../models");
const Op = db.Sequelize.Op;

module.exports = {
	verifyToken(req, res, next) {
		let tokenHeader = req.headers["x-access-token"];
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
				message: "Error",
				errors: "Incorrect token format",
			});
		}

		let token = tokenHeader.split(" ")[1];

		if (!token) {
			return res.status(403).send({
				auth: false,
				message: "Error",
				errors: "No token provided",
			});
		}

		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				return res.status(500).send({
					auth: false,
					message: "Error",
					errors: err,
				});
			}
			req.userId = parseInt(decoded.id);
			next();
		});
	},

	isAdmin(req, res, next) {
		return UserRole.findAll({
			include: [
				{
					model: Role,
					attributes: ['id', 'name'],
					where: {
						name: 'ADMIN'
					}
				}
			],
			where: {
                user_id: req.userId
            }
		})
		// return User.findOne({
		// 	include: [
		// 		{
		// 			model: Role,
		// 			attributes: ['id','name'],
		// 			where: {
		// 				name: 'ADMIN'
		// 			}
		// 		}
		// 	],
		// 	where: {
        //         id: req.userId,
        //     },
		// })
		.then((user)=>{
			console.log(user);
			if(user.length<=0){
				res.status(200).send({
					auth: false,
					message: "Require Admin Role",
				});
				return; 
			}
			next();
			return;
		})
		.catch((err)=>{
			console.error(err);
		});
		// User.findByPk(req.userId).then((user) => {
		// 	user.getRoles().then((roles) => {
		// 		for (let i = 0; i < roles.length; i++) {
		// 			console.log(roles[i].name);
		// 			if (roles[i].name.toUpperCase() === "ADMIN") {
		// 				next();
		// 				return;
		// 			}
		// 		}
		// 		res.status(403).send({
		// 			auth: false,
		// 			message: "Error",
		// 			message: "Require Admin Role",
		// 		});
		// 		return;
		// 	});
		// });
	},

	isAdminAndUser(req, res, next) {
		return UserRole.findAll({
			include: [
				{
					model: Role,
					attributes: ['id', 'name'],
					where: {
						name: {
							[Op.in]: ['ADMIN', 'USER']
						}
					}
				}
			],
			where: {
                user_id: req.userId
            }
		})
		// return User.findOne({
		// 	include: [
		// 		{
		// 			model: Role,
		// 			attributes: ['id','name'],
		// 			where: {
		// 				name: 'ADMIN'
		// 			}
		// 		}
		// 	],
		// 	where: {
        //         id: req.userId,
        //     },
		// })
		.then((user)=>{
			console.log(user);
			if(user.length<=0){
				res.status(403).send({
					auth: false,
					message: "Require Admin Role",
				});
				return; 
			}
			next();
			return;
		})
		.catch((err)=>{
			console.error(err);
		});
		// User.findByPk(req.userId).then((user) => {
		// 	user.getRoles().then((roles) => {
		// 		for (let i = 0; i < roles.length; i++) {
		// 			console.log(roles[i].name);
		// 			if (roles[i].name.toUpperCase() === "ADMIN") {
		// 				next();
		// 				return;
		// 			}
		// 		}
		// 		res.status(403).send({
		// 			auth: false,
		// 			message: "Error",
		// 			message: "Require Admin Role",
		// 		});
		// 		return;
		// 	});
		// });
	},
};
