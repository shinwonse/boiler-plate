const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10

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
    bcrtpy.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
            cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User };