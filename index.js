const express = require('express')
const app = express()
const moment = require('moment')
const port = 5000

const route_api = require('./api')


app.use((req, res, next) => {
    console.log(`LOGGED:${moment().format('MMMM Do YYYY,h:mm:ss a')}`)
    next()
  })
  app.use('/api', route_api)
  app.get('/', (req, res) => {
    res.send("Home")
  })
  app.get('/about', (req, res) => {
    res.send("<h1>เจ้าต้าวอ้วงงงง</h1>")
  })

  
  app.post('/', function (req, res) {
    res.send('Got a POST request')
  })
  app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
  })
  app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
  })
// app.get('/', (req, res) => 
// res.send('res นี่คือการส่งกลับไปยัง Browser')

// )


//รับ parameter แบบ Query string
// GET
// localhost:5000/student?code=1234&x=5&y=8
app.get('/student', (req, res) => {
  console.log(req.query);
  res.send("<h1>Student Query string</h1> " + req.query.code )
})

// รับ parameter แบบ Url Params
 app.get('/student/:code', (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.send("<h1>Student url parem</h1> " + req.params.code )
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))