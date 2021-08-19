const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //비밀번호 암호화 모듈
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    img : {
        String
    },
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
})

//유저모델(userSchema)에 app.js user.save를 하기전에 콜백함수를 실행한다
userSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){ //비밀번호 변경된때마다
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else { // 다른 부분 변경
        next();
    }
})

//패스워드 확인 커스텀 메소드
//bcrypt.compare = 새로 입력한 패스워드가 기존에 해싱시킨 패스워드와 같으면 true, 아니면 false를 반환한다.
userSchema.methods.comparePassword = function(plainPassword , cb){
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) throw cb(err);
            cb(null,isMatch)
    });
}

//토큰 생성 커스텀 메소드
userSchema.methods.generateToken = function(cb){
    var user = this; // this -> userSchema
    //jsonwebtoken을 이용해서 token을 생성하기
    // id = databases _id값
    // user._id + 'secretToken' = token , 'secretToken' -> user._id
    // payload to be a plain object > toHexString
    var token = jwt.sign(user._id.toHexString(),'secretToken');
    user.token = token;
    user.save(function(err,user){
        if(err) throw cb(err)
        cb(null,user) //user -> app.js -> user.generateToken('err','이곳')
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + ''  = token
    //토큰을 decode 한다. 
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User',userSchema)
module.exports = { User }