const Posts = require("../models").Post;

module.exports = {
	list(req, res) {
		return Posts.findAll({
			order: [["createdAt", "DESC"]],
		})
			.then((posts) => {
				const results = {
					status: "success",
					data: posts,
					count: posts.length,
					errors: null,
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
