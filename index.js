const express = require('express')
const database = require('./src/db/knex')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const bodyParser = require("body-parser")
const cors = require('cors')
const app = express()

app.use(bodyParser.urlencoded({
  extended:false
}))
app.use(bodyParser.json())
app.use(cors())
app.get('/',(req,res)=>{
  res.send("hello world")
})
app.post('/users',(req, res)=>{
  // console.log(req.body);
  const { user } = req.body
  bcrypt.hash(user.password, 12)
      .then(hashed_password => {
         return database("users")
              .insert({
                  email: user.email,
                  password: hashed_password,
                  first_name:'kkk',
                  last_name:'kkk'
              }) 
              .returning("*")
              .then(users => {
                  const user = users[0]
                  res.json({ user })
              }).catch(error => {
                  res.json({ error: error.message })
              })
      })
})
app.listen(5000, ()=>console.log("Server is running on 5000"));
