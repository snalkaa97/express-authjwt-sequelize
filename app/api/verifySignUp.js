const User = require('../models').User;
const config = require('../config/configRoles.js');
const ROLEs = config.ROLEs;

module.exports = {
    checkDuplicateUserNameOrEmail(req, res, next) {
        User.findOne({
            where: {
                id: req.body.id
            }
        }).then(user => {
            if(user){
                res.status(400).send({
                    auth: false,
                    id: req.body.id,
                    message: "Error",
                    errors: "Id is already in use"
                })
                return;
            }

            User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(user => {
                if(user){
                    res.status(400).send({
                        auth: false,
                        id: req.body.id,
                        message: "Error",
                        errors: "Email is already in use"
                    })
                    return;
                }
                next();
            })
        })
    }, 

    checkRolesExisted(req, res, next) {
        for(let i = 0; i < req.body.roles.length; i++) {
            console.log(req.body.roles[i]);
            if(!ROLEs.includes(req.body.roles[i].toUpperCase())) {
                res.status(400).send({
					auth: false,
					id: req.body.id,
					message: "Error",
					errors: "Does NOT exist Role = " + req.body.roles[i]
				});
				return;
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
    }
}