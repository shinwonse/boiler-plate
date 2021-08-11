const mongoose = require('mongoose');

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
        type: toString,
    },
    tokenExp: { // 토큰이 사용할 수 있는 기간
        type: Number
    }
    
})

const User = mongoose.model('User', userSchema);

module.exports = { User };