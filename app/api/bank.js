const Bank = require("../models").Bank;
const db = require("../models");
const Op = db.Sequelize.Op;
const { paginates } = require("../helpers/index");

module.exports = {
	async getAll(req, res) {
		console.log(req.query);
		let { page } = req.query;
		page = parseInt(page || 1);
		let { limit } = req.query;
		limit = parseInt(limit || 10);
		if (!req.query.name && !req.query.email) {
			const banks = await Bank.paginate({
				page: page,
				paginate: limit,
				attributes: ["id", "name"],
				order: [["id", "DESC"]],
			});
			const totalPage = Math.ceil(banks.total / limit);
			let paginations = paginates({ current: page, max: totalPage });
			console.log(paginations);
			let pagination = {
				first_page_url: 1,
				from: banks.total,
				page: page,
				items_per_page: limit,
				last_page: Math.ceil(banks.total / limit),
				links: paginations,
			};
			return res.status(200).send({
				data: banks.docs,
				currentPage: banks.pages,
				totalPage: Math.ceil(banks.total / limit),
				total: banks.total,
				pagination,
			});
		} else {
			let where = {};
			let name = req.query.name ? { [Op.iLike]: `%${req.query.name}%` } : null;
			name ? (where.name = name) : null;
			const banks = await Bank.paginate({
				attributes: ["id", "name"],
				page: page,
				paginate: limit,
				where: where,
				order: [["id", "DESC"]],
			});
			const totalPage = Math.ceil(banks.total / limit);
			let paginations = paginates({ current: page, max: totalPage });
			let pagination = {
				first_page_url: 1,
				from: banks.total,
				page: page,
				items_per_page: limit,
				last_page: Math.ceil(banks.total / limit),
				links: paginations,
			};
			return res.status(200).send({
				data: banks.docs,
				currentPage: banks.pages,
				totalPage: Math.ceil(banks.total / limit),
				total: banks.total,
				pagination,
			});
		}
	},

	async create(req, res) {
		const bank = await Bank.findOne({
			where: {
				name: req.body.name,
			},
		});
		if (bank) {
			return res.status(400).send({
				auth: false,
				id: req.body.id,
				message: "Bank name is already in use",
				errors: "Bank name is already in use",
			});
		}

		return Bank.create({
			name: req.body.name,
		})
			.then((data) => {
				res.status(200).send({
					success: true,
					data,
					message: "Bank created successfully",
					error: null,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).send(err);
			});
	},

	async update(req, res) {
		const { id } = req.params;
		const { name } = req.body;

		const bank = await Bank.findByPk(id);
		if (!bank) {
			return res.status(404).send({
				message: "bank not found",
			});
		}
		await Bank.update(
			{ name },
			{
				where: {
					id: id,
				},
			}
		)
			.then((data) => {
				return res.status(200).send({
					data,
					message: "success",
					error: null,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).send(err);
			});
	},

	async delete(req, res) {
		const { id } = req.params;
		const bank = await Bank.findByPk(id);
		if (!bank) {
			return res.status(404).send({
				message: "bank not found",
			});
		}
		await Bank.destroy({
			where: {
				id: id,
			},
		})
			.then(() => {
				return res.status(200).send({
					data: bank,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).send(err);
			});
	},
};
