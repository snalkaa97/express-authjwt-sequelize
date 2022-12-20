const verifySignUpController = require('../api').verifySignUp;
const verifySignController = require('../api').verifySign;
const pegawaiController = require('../api').pegawai;
const verifyJwtTokenController = require('../api').verifyJwtToken;

module.exports = function(app){

    app.post('/api/auth/signup',
    [verifySignUpController.checkDuplicateUserNameOrEmail, verifySignUpController.checkRolesExisted], verifySignController.signup);

	app.post('/api/auth/signin', verifySignController.signin);

    //pegawai

    app.get('/api/pegawai', 
    [
        verifyJwtTokenController.verifyToken, 
        // verifyJwtTokenController.isAdmin
    ], pegawaiController.list);

    app.post('/api/pegawai', 
    [
        verifyJwtTokenController.verifyToken, 
        // verifyJwtTokenController.isAdmin
    ], pegawaiController.add);
    
}