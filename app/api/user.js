const User = require("../models").User;
const db = require("../models");
const Op = db.Sequelize.Op;
const UserRole = require("../models").UserRole;
const Role = require("../models").Role;


function paginates({current, max}) {
	if (!current || !max) return null

	let prev = current === 1 ? null : current - 1,
			next = current === max ? null : current + 1,
			items = [1]

	if (current === 1 && max === 1) return {current, prev, next, items}
	if (current > 4) items.push('…')

	let r = 2, r1 = current - r, r2 = current + r

	for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i)

	if (r2 + 1 < max) items.push('…')
	if (r2 < max) items.push(max)

	return {current, prev, next, items}
}
module.exports = {
	async getUsers(req, res) {
        let {page} = req.query;
        page = parseInt(page || 1);
        let {limit} = req.query;
        limit = parseInt(limit || 10);
		if (!req.query.name && !req.query.email) {
			const users = await User.paginate({
				include: [
					{
						model: UserRole,
						attributes: ['role_id'],
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
				attributes: ['id','name','email'],
                order: [["id", "DESC"]],
			});
            const totalPage = Math.ceil(users.total/limit)
            let paginations = paginates({current:page, max:totalPage})
            let pagination = {
                first_page_url: 1,
                from: users.total,
                page: page,
                items_per_page: limit,
                last_page: Math.ceil(users.total/limit),
                links: paginations
            }
			return res.status(200).send({data:users.docs, currentPage:users.pages, totalPage: Math.ceil(users.total/limit), total:users.total, pagination});
		} else {
			let where = {};
			let name = req.query.name ? { [Op.like]: `%${req.query.name}%` } : null;
			let email = req.query.email
				? { [Op.like]: `%${req.query.email}%` }
				: null;
			name ? (where.name = name) : null;
			email ? (where.email = email) : null;
			const users = await User.paginate({
				include: [
					{
						model: UserRole,
						attributes: ['role_id'],
						include: [
							{
								model: Role,
								attributes: ["name"],
							},
						],
					},
				],
				attributes: ['id','name','email'],
                page: page,
                paginate: limit,
				where: where,
                order: [["id", "DESC"]],
			});
            const totalPage = Math.ceil(users.total/limit)
            let paginations = paginates({current:page, max:totalPage})
            let pagination = {
                first_page_url: 1,
                from: users.total,
                page: page,
                items_per_page: limit,
                last_page: Math.ceil(users.total/limit),
                links: paginations
            }
			return res.status(200).send({data:users.docs, currentPage:users.pages, totalPage: Math.ceil(users.total/limit), total:users.total, pagination});
		}
	},
	async updateUser(req, res){
		const {id} = req.params;
		const {name, email} = req.body;
		const user = await User.findByPk(id);
		if(!user){
			return res.status(404).send({
				message: 'user not found'
			});
		}
		await User.update({ name: name, email: email}, {
			where: {
			  id: id
			}
		  })
		.then(async()=>{
			//delete role dahulu
			await UserRole.destroy({
				where: {
					user_id: id
				}
			})
			const roles = await Role.findAll({
				where:{
					name: {
						[Op.in]: req.body.roles,
					},
				}
			})
			if(!roles.length>0){
				return res.status(404).send({
					message: 'role not found'
				})
			}
			roles.map((role)=>{
				UserRole.create({
					user_id: user.id,
					role_id: role.id,
				});
			})
			return res.status(200).send({
				data: user
			})
		})
		.catch((err)=>{
			console.log(err)
			return res.status(500).send(err)
		})
	},

	async deleteUser(req, res) {
		const {id} = req.params
		const user = await User.findByPk(id);
		if(!user){
			return res.status(404).send({
				message: 'User not found'
			})
		}
		await User.destroy({
			where: {
				id: id
			}
		})
		.then(()=>{
			return res.status(200).send({
				data: user
			})
		})
		.catch((err)=>{
			console.log(err)
			return res.status(500).send(err)
		})
	}
};
