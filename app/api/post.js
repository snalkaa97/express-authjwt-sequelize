const Posts = require("../models").Post;
const db = require("../models");
const { QueryTypes } = require("sequelize");

module.exports = {
	async list(req, res) {
		const [results, metadata] = await db.sequelize.query(
			`SELECT "Users".name as author_by, "Posts".title, "Posts".desc FROM "Posts" JOIN "Users" ON "Posts".user_id::varchar = "Users".id`
		);
		// console.log(results);
		const data = {
			status: "success",
			data: results,
			count: results.length,
			errors: null,
		};
		return res.status(200).send(data);
		// return Posts.findAll({
		// 	order: [["createdAt", "DESC"]],
		// })
		// 	.then((posts) => {
		// 	})
		// 	.catch((err) => {
		// 		res.status(400).send({
		// 			status_response: "Bad Request",
		// 			errors: err,
		// 		});
		// 	});
	},

	add(req, res) {
		console.log("user_id", req.userId);
		return Posts.create({
			title: req.body.title,
			desc: req.body.desc,
			user_id: req.userId,
		})
			.then((post) => {
				const results = {
					data: post,
					status: "success",
				};
				res.status(200).send(results);
			})
			.catch((err) => {
				res.status(400).send({
					status_response: "Bad Request",
					errors: err,
				});
			});
	},
};
