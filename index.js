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

app.post('/user/login', (req, res)=>{
  const {user} = req.body;
  database("users")
  .where({email: user.email })
  .first()
  .then(retrievedUser => {
      if(!retrievedUser) throw new Error("user not found!")
      bcrypt.compare(user.password, retrievedUser.password)
      .then(results => {
        
          if(results===false)
                 {throw new Error("wrong Password!")
                return}
          const payload = {email: user.email}
          const secret =  "SECRET"
          jwt.sign(payload, secret, (error, token) => {
              if(error) throw new Error("Sign in error!")
              res.json({token, user})
          }).catch(error => {
              res.json({message: error.message})
          })
      })
  })
})
app.listen(5000, ()=>console.log("Server is running on 5000"));
