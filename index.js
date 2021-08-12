const express = require('express'); // express 모듈을 가져오고
const app = express(); // express function을 이용해서 새로운 express app을 만들고
const port = 5000; // port는 아무 port나 가능
const bodyParser = require('body-parser'); // body-parser 모듈을 가져옴

const config = require('./config/key'); // key.js 가져옴

const { User } = require("./models/User"); // User Schema를 가져옴

// application/x-ww-from-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected...'))
  .catch(err => {console.log(err)})



app.get('/', (req, res) => { // root 디렉토리에 오면 'Hello World!' 출력
  res.send('Hello World!')
})

app.post('/register', (req,res) => { // 회원가입을 위한 route

  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body)
  // save 하기 전에 암호화를 해야함
  user.save((err, userInfo) => {
    if(err) return res.json({ success : false, err });
    return res.status(200).json({ // status(200)은 성공했다는 뜻.
      success: true
    })
  })
})

app.listen(port, () => { // port 5000 번에서 이 app을 실행
  console.log(`Example app listening at http://localhost:${port}`)
})
