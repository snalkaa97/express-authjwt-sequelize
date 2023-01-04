const Posts = require("../models").Post;
const User = require("../models").User;
const db = require("../models");
const { QueryTypes } = require("sequelize");
const Op = db.Sequelize.Op;

module.exports = {
	async list(req, res) {
		return Posts.findAll({
			// include: [User], ini semua attribute table user ditampilkan
			include: [
				{
					model: User,
					attributes: {
						exclude: ['password', 'createdAt', 'updatedAt']
					}
				}
			],
			attributes: ['id', 'title', 'desc']
		})
		.then((response)=>{
			const data = {
				status: "success",
				data: response,
				count: response.length,
				errors: null,
			};
			return res.status(200).send(data);
		})

		//ini contoh Raw Query
		const [results, metadata] = await db.sequelize.query(
			`SELECT "Users".name as author_by, "Posts".title, "Posts".desc FROM "Posts" JOIN "Users" ON "Posts".user_id = "Users".id`
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
				Posts.findOne({
					include: [
						{
							model: User,
							attributes: {
								exclude: ['password', 'createdAt', 'updatedAt']
							}
						}
					],
					attributes: ['id', 'title', 'desc'],
					where:{
						id: post.id
					}
				})
				.then((posts)=>{
					const results = {
						data: posts,
						status: "success",
					};
					res.status(200).send(results);
				})
			})
			.catch((err) => {
				res.status(400).send({
					status_response: "Bad Request",
					errors: err,
				});
			});
	},

	update(req, res){
		return Posts.findByPk(req.params.id)
		.then((post) => {
			if(!post){
				return res.status(400).send({
					status_response: "Bad Request",
					errors: "Post not found",
				})
			}
			if(post.id != req.params.id){
				return res.status(400).send({
					status_response: "Bad Request",
					errors: "Post not found",
				})
			}
			return post.update(req.body)
			.then((updatedPost) => {
                const results = {
					data: updatedPost,
                    status: "success",
				}
				res.status(200).send(results);
			})
			.catch((err) => {
				res.status(400).send({
					status_response: "Bad Request",
                    errors: err,
				})
			})
		})
	},

	delete(req, res){
		return Posts.findByPk(req.params.id)
		.then((post) => {
			if(!post){
				return res.status(400).send({
					status_response: "Bad Request",
					errors: "Post not found",
				})
			}
			if(post.id != req.params.id){
				return res.status(400).send({
					status_response: "Bad Request",
					errors: "Post not found",
				})
			}
			return post.destroy()
			.then((destroy) => {
                const results = {
                    status: "success",
				}
				res.status(200).send(results);
			})
			.catch((err) => {
				res.status(400).send({
					status_response: "Bad Request",
                    errors: err,
				})
			})
		})
	},
	
};
