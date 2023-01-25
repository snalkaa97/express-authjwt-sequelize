const Pegawai = require("../models").Pegawai;
const db = require("../models");
const { QueryTypes } = require("sequelize");

const redis = require("redis");
const { promisify } = require("util");

let redisClient;

(async () => {
	redisClient = redis.createClient();

	redisClient.on("error", (error) => console.error(`Error : ${error}`));

	await redisClient.connect();
})();

// const getAsync = promisify(redisClient.get).bind(redisClient);
// console.log(getAsync);
module.exports = {
	async getById(req, res) {
		const id = req.params.id;
		let results;
		let isCached = false;
		try {
			const cacheResults = await redisClient.get(`pegawais:${id}`);
			if (cacheResults) {
				isCached = true;
				results = JSON.parse(cacheResults);
			} else {
				results = await Pegawai.findByPk(req.params.id);
				if (!results) {
					return res.status(404).send({
						status_response: "Not Found",
						errors: "Pegawai Not Found",
					});
				} else {
					await redisClient.set(`pegawais:${id}`, JSON.stringify(results));
				}
			}
			res.send({
				fromCache: isCached,
				data: results,
			});
		} catch (error) {
			console.log(error);
			res.status(400).send({
				pegawai_response: "Bad Request",
				errors: error,
			});
		}
	},

	async list(req, res) {
		//contoh raw query
		// const pegawais = await db.sequelize.query(`SELECT * FROM "Pegawais"`, {
		// 	type: QueryTypes.SELECT,
		// });
		// console.log(pegawais);
		let isCached = false;
		const cachedData = JSON.parse(await redisClient.get("pegawais:all"));
		const pegawais = cachedData ? cachedData : await Pegawai.findAll();
		if(cachedData){
			isCached = true;
		} else {
			await redisClient.set("pegawais:all", JSON.stringify(pegawais));
		}
		if(!pegawais){
			return res.status(404).send({
				status_response: "Not Found",
				errors: "Pegawai Not Found",
			});
		}
		const pegawai = {
			status: "success",
			isCached: isCached,
			count: pegawais.length,
			data: pegawais,
			errors: null,
		};
		res.status(200).send(pegawai);
	},

	add(req, res) {
		const pegawai = Pegawai.create(req.body);
		return pegawai
			.then(async (doc) => {
				console.log(doc.dataValues);
				const results = {
					data: doc,
					status: "success",
				};
				//updaate cachce
				const pegawais = await Pegawai.findAll();
				await redisClient.set("pegawais:all", JSON.stringify(pegawais));
				res.status(200).send(results);
			})
			.catch((error) => {
				res.status(400).send({
					status_response: "Bad Request",
					errors: error,
				});
			});
	},

	//update
	update(req, res) {
		return Pegawai.findByPk(req.params.id, {}).then((pegawai) => {
			if (!pegawai) {
				return res.status(404).send({
					status_response: "Bad Request",
					errors: "Pegawai Not Found",
				});
			}
			if (pegawai.id != req.params.id) {
				return res.status(400).send({
					status_response: "Bad Request",
					errors: "Pegawai Not Found",
				});
			}
			return pegawai
				.update(req.body)
				.then(async(doc) => {
					const results = {
						data: doc.dataValues,
						status: "success",
					};
					const pegawais = await Pegawai.findAll();
					await redisClient.set("pegawais:all", JSON.stringify(pegawais));
					redisClient.set(`pegawais:${doc.dataValues.id}`, JSON.stringify(doc.dataValues));
					res.status(200).send(results);
				})
				.catch((error) => {
					console.log(error);
					res.status(400).send({
						status_response: "Bad Request",
						errors: error,
					});
				});
		});
	},

	delete(req, res) {
		return Pegawai.findByPk(req.params.id).then((pegawai) => {
			if (!pegawai) {
				return res.status(404).send({
					status_response: "Bad Request",
					errors: "Pegawai Not Found",
				});
			}
			if (pegawai.id != req.params.id) {
				return res.status(400).send({
					status_response: "Bad Request",
					errors: "Pegawai Not Found",
				});
			}
			return pegawai
				.destroy()
				.then(async(doc) => {
					const pegawais = await Pegawai.findAll();
					await redisClient.set("pegawais:all", JSON.stringify(pegawais));
					res.status(200).send({ status: "success" });
				})
				.catch((error) => {
					res.status(400).send({
						status_response: "Bad Request",
						errors: error,
					});
				});
		});
	},
};
