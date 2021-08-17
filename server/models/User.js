const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: 
    {
        type: String,
        trim: true, // 스페이스를 없애주는 역할
        unique: 1 // 똑같은 이메일을 쓰지 못하게
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, // ex) number가 1이면 관리자고 number가 0이면 일반 유저고...
        default: 0
    },
    image: String,
    token: { // 유효성 관리
        type: String,
    },
    tokenExp: { // 토큰이 사용할 수 있는 기간
        type: Number
    }
    
})

userSchema.pre('save', function(next){
    var user = this; // 위 schema를 가리킴

    if(user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) { // salt 생성, 에러가 나면 에러를 가져오고 아니면 salt
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){ // hash는 암호화된 비밀번호
                if(err) return next(err)
                user.password = hash // 에러 안나고 성공하면 유저 패스워드를 해시로 교체
                next()
            }) 
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567    암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){ // plainPassword를 암호화해서 비교를한다.
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id + 'secretToken' = token
    // 'secretToekn' -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err) // 만약 err 발생시 err 를 콜백해주고
        cb(null, user) // 에러가 발생하지 않았다면 콜백에서 err 는 null 이고 user 정보를 전달해줌
    })
}

userSchema.statics.findByToken = function(token,cb) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err,decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져오 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err,user){ // mongoDB 메소드 id와 token 이용

            if(err) return cb(err);
            cb(null,user)
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User };