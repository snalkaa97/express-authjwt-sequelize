const User = require("../models").User;
const db = require("../models");
const Op = db.Sequelize.Op;
const UserRole = require("../models").UserRole;
const Role = require("../models").Role;

module.exports = {
	async getUsers(req, res) {
        let {page} = req.query;
        page = page || 1;
        let {limit} = req.query;
        limit = limit || 25;
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
				attributes: ['id','name','email']
			});
            let links = []
            let obj = {}
            const totalPage = Math.ceil(users.total/limit)
            const currentPage = users.pages;
            for(let i = 0; i <= totalPage; i++){
                obj = {};
                if(totalPage<=3){
                    if(i==0){
                        obj['url'] = currentPage - 1;
                        obj['label'] = "&laquo; Previous";
                        obj['page'] = currentPage - 1;
                        obj['active'] = false;
                    } else if (i<currentPage){
                        obj['url'] = currentPage - i;
                        obj['label'] = currentPage - i;
                        obj['page'] = currentPage - i;
                        obj['active'] = true
                    } else if(i==1 && currentPage!=page){
                        obj['url'] = currentPage - 2;
                        obj['label'] = currentPage - 2;
                        obj['page'] = currentPage - 2;
                        obj['active'] = (page == currentPage);
                    }
                    links.push(obj)
                }
            }
            let pagination = {
                first_page_url: 1,
                from: users.total,
                last_page: Math.ceil(users.total/limit),
                links
            }
			return res.status(200).send({data:users.docs, currentPage:users.pages, totalPage: Math.ceil(users.total/limit), total:users.total});
		} else {
			let where = {};
			let name = req.query.name ? { [Op.like]: `%${req.query.name}%` } : null;
			let email = req.query.email
				? { [Op.like]: `%${req.query.email}%` }
				: null;
			name ? (where.name = name) : null;
			email ? (where.email = email) : null;
			console.log(where);
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
                page:1,
                paginate:15,
				where: where,
			});
			return res.status(200).send(users);
		}
	},
};
