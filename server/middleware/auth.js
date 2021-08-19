const {User} = require('../models/User');
let auth = (req,res,next) => {
    //인증처리를 하는곳
    //클라이언트 쿠키에서 토큰을 가여온다
    let token = req.cookies.x_auth;
    //토큰을 복호화 한후 유저를 찾는다
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth : false,error:true})

        req.token = token;
        req.user = user;
        next();
    });
    //유저가 있으면 인증 시킨다 , 없으면 인증 안함
};

module.exports = { auth };