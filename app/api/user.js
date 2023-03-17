const User = require('../models').User;
const db = require("../models");
const Op = db.Sequelize.Op;

module.exports = {
    async getUsers (req, res){
        if(!req.query.name && !req.query.email){
            const users = await User.findAll();
            return res.status(200).send(users)
        } else {
            let where = {};
            let name = req.query.name ? {[Op.like]: `%${req.query.name}%`}: null;
            let email = req.query.email ? {[Op.like]: `%${req.query.email}%`}: null;
            name ? where.name = name : null;
            email ? where.email = email : null;
            console.log(where);
            const users = await User.findAll({
                where: where
            });
            return res.status(200).send(users)
        }
    }
}