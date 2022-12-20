const Pegawai = require('../models').Pegawai;

module.exports = {
    getById(req, res){
        return Pegawai.findByPk(req.params.id, {
            include:[],
        })
        .then((doc)=>{
            if(!doc){
                return res.status(404).send({
                    status_response: 'Not Found',
                    errors: 'Pegawai Not Found',
                });
            }
            const pegawai = {
                pegawai_response: 'Created',
                pegawai: doc,
                errors: null
            }
            return res.status(200).send(pegawai);
        })
        .catch((error)=>{
            res.status(400).send({
                pegawai_response: 'Bad Request',
                errors: error
            })
        })
    },

    list(req, res){
        return Pegawai.findAll({
            limit: 10,
            include:[],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        .then(docs => {
            const statuses = {
              status_response: 'OK',
              count: docs.length,
              statuses: docs.map(doc => {
                return doc
              }),
              errors: null
            }
            res.status(200).send(statuses);
          })
          .catch((error) => {
            res.status(400).send({
          status_response: 'Bad Request',
              errors: error
            });
          });
    },

    add(req, res){
        const pegawai = Pegawai.create(req.body)
        return pegawai
        .then((doc) => {
            console.log(doc.dataValues);
            const results = {
                data: doc,
                status: 'success'
            }
            res.status(200).send(results);
        })
        .catch((error) => {
            res.status(400).send({
              status_response: 'Bad Request',
              errors: error
            });
        })
    },

    //update
    update(req, res){
        return Pegawai.findByPk(req.params.id,{})
        .then(pegawai =>{
            if(!pegawai){
                return res.status(404).send({
                    status_response: 'Bad Request',
                    errors: 'Pegawai Not Found',
                })
            }
            console.log(pegawai);
            if(pegawai.id != req.params.id){
                return res.status(400).send({
                    status_response: 'Bad Request',
                    errors: 'Pegawai Not Found',
                })
            }
            return pegawai.update(req.body)
            .then((doc)=>{
                const results = {
                    data: doc.dataValues,
                    status:'success'
                }
                res.status(200).send(results);
            })
            .catch((error)=>{
                res.status(400).send({
                  status_response: 'Bad Request',
                  errors: error
                })
            })
        })
    }
}