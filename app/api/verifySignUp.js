const User = require("../models").User;
const config = require("../config/configRoles.js");
const ROLEs = config.ROLEs;

module.exports = {
	checkDuplicateUserNameOrEmail(req, res, next) {
		User.findOne({
			where: {
				email: req.body.email,
			},
		}).then((user) => {
			if (user) {
				res.status(400).send({
					auth: false,
					id: req.body.id,
					message: "Email is already in use",
					errors: "Email is already in use",
				});
				return;
			}
			next();
		});
	},

	checkRolesExisted(req, res, next) {
		if (!req.body.roles) {
			req.body.roles = [];
			req.body.roles[0] = "USER";
			console.log(req.body.roles);
		} else {
			for (let i = 0; i < req.body.roles.length; i++) {
				console.log(req.body.roles[i]);
				if (!ROLEs.includes(req.body.roles[i].toUpperCase())) {
					res.status(400).send({
						auth: false,
						id: req.body.id,
						message: "Does NOT exist Role = " + req.body.roles[i],
						errors: "Does NOT exist Role = " + req.body.roles[i],
					});
					return;
				}
			}
		}
		// if(!ROLEs.includes(req.body.role.toUpperCase())) {
		//     res.status(400).send({
		//         auth: false,
		//         id: req.body.id,
		//         message: "Error",
		//         errors: "Does NOT exist Role = " + req.body.role
		//     });
		//     return;
		// }
		next();
	},
};
