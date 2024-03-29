const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require('./models/User');

app.use(bodyParser.urlencoded({extended : true}));

app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology : true , useCreateIndex : true , useFindAndModify : false
}).then(() => console.log('MongoDB Connected...'))
.catch(err=> console.log(err))
app.get('/',(req,res)=>{
    res.send('노드 서버');
})

app.get('/api/hello',(req,res)=>{
  res.send('안녕');
})

app.post('/api/users/register',(req,res) => {
    //회원가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다
    const user = new User(req.body);
    user.save((err,userInfo) => {
        if(err) return res.json({success : false,err})
        return res.status(200).json({
          success : true
        });
    });
})

app.post('/api/users/login', (req, res) => {
    // console.log('ping')
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
  
      // console.log('user', user)
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }
  
      //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
      user.comparePassword(req.body.password, (err, isMatch) => {
        // console.log('err',err)
  
        // console.log('isMatch',isMatch)
  
        if (!isMatch)
          return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
  
        //비밀번호 까지 맞다면 토큰을 생성하기.
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
  
          // 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지 
          res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        })
      })
    })
})
  
app.get('/api/users/auth',auth,(req,res) => {
    //여기 까지 미들웨어를 통과해 왔다는 이유는 Auth가 true라는 말
    res.status(200).json({
         _id : req.user._id, //여기서 user정보를 가져올수있는 이유는 auth findByToken인자값으로 user를 받았는데 그건 User.js > this즉 User객체를 reutrn했기 때문
         isAdmin : req.user.role === 0 ? false : true,
         isAuth: true,
         email : req.user.email,
         name : req.user.name,
         lastname : req.user.lastname,
         role : req.user.role,
         image : req.user.image
    });
})

app.get('/api/users/logout',auth,(req,res) => { //req,res
    User.findOneAndUpdate({_id:req.user._id},
        { token : ""}
        , (err,user)=>{
            if(err) return res.json({success : false , err});
            return res.status(200).send({
                success : true
            })
        }) //auth미들웨어에서 user 넣어놈
})
//대문자 User = User.js 유저 모델 , 소문자 user = 콜백 함수 인자

app.listen(port,()=>{
    console.log('start');
});