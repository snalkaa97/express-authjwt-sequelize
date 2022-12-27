const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const User = require('../models').User
const Role = require('../models').Role
const UserRole = require('../models').UserRole
const Op = db.Sequelize.Op;
const config = require('../config/configRoles');

module.exports = {
    signup(req, res){
        Role.findAll({
            where: {
                name: {
                    [Op.in]: req.body.roles
                }
            },
            attributes: ['id']
        })
        .then((role)=>{
            if(!role.length<=0){
                return res.status(200).send({
                    auth: false,
                    id: req.body.id,
                    message: 'Role not found',
                })
            }
            role.map(x=>{
                UserRole.create({
                    user_id: req.body.id,
                    role_id: x.id
                })
            })
            // console.log(role.dataValues.id);
            return User.create({
                name:req.body.name,
                id:req.body.id,
                email:req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                // role_id: role.dataValues.id
            })
            .then(user=>{
                // Role.findAll({
                //     where:{
                //         name:{
                //             [Op.ord]:req.body.roles
                //         }
                //     }
                
                res.status(200).send({
                    auth: true,
                    id: req.body.id,
                    message: "User registered successfully.",
                    error: null,
                })
                return;
                // })
    
            }).catch(err => {
                res.status(500).send({
                    auth: false,
                    message: "Error",
                    errors: err,
                })
            })
        })
        .catch((err)=>{
        //    return res.status(500).send({
        //         auth: false,
        //         message: "Error",
        //         errors: err,
        //     })
            console.error(err);
        })
    },

    signin(req, res){
        // console.log(req.body);
        return User.findOne({
            where:{
                email:req.body.email
            }
        })
        .then(user=>{
            // console.log(user);
            if(!user){
                return res.status(404).send({
                    auth: false,
                    id: req.body.id,
                    accessToken: null,
                    message: "Error",
                    errors: "User Not Found."
                });
            }
            var token = 'Bearer ' + jwt.sign(
                {
                id: user.id
                }, 
                config.secret, 
                {
                expiresIn: 86400 //24h expired
                }
            );

            console.log(token);

            res.status(200).send({
                auth: true,
                id: req.body.id,
                accessToken: token,
                message: "Error",
                errors: null
            });
        })
        .catch(err=>{
            res.status(500).send({
                auth: false,
                id: req.body.id,
                accessToken: null,
                message: "Error",
                errors: err
            });
        })
    }

}