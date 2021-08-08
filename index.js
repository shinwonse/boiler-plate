const express = require('express') // express 모듈을 가져오고
const app = express() // express function을 이용해서 새로운 express app을 만들고
const port = 5000 // port는 아무 port나 가능

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://wonse:<password>@boilerplate.zawty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})



app.get('/', (req, res) => { // root 디렉토리에 오면 'Hello World!' 출력
  res.send('Hello World!')
})

app.listen(port, () => { // port 5000 번에서 이 app을 실행
  console.log(`Example app listening at http://localhost:${port}`)
})