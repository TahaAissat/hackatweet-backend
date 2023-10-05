var express = require('express');
var router = express.Router();
const uid2 = require('uid2')
const bcrypt = require('bcrypt')
const User = require('../models/users')
const {checkBody} = require('../modules/checkBody')



// Route création user
router.post('/signup', (req,res) => {
  // Verification of all input fields
  if(!checkBody(req.body,['firstname','username','password'])){
    res.json({result:false,error:'Missing or empty fields'})
    return
  }
  // Hash + Generation token
  let hash = bcrypt.hashSync(req.body.password,10)
  let token = uid2(32)
  // Check if user already registered
  User.findOne({username:req.body.username})
  .then(data => {
    if(data === null){
      const newUser = new User ({
        firstname : req.body.firstname,
        username : req.body.username,
        password : hash,
        token : token
      })
      newUser.save().then((data) => {
        console.log(data)
        res.json({result:true, token , username:data.username , firstname : data.firstname})
      })
    } else {
        res.json({result:false,error:'Username taken'})
    }
  })
})


// Route connection
router.post('/signin' , (req,res) => {
  if(!checkBody(req.body,['username','password'])){
    res.json({result:false,error:'Missing or empty fields'})
    return
  }
  User.findOne({username:req.body.username})
  .then(data => {
    if(data && bcrypt.compareSync(req.body.password,data.password)){
      res.json({result:true,token:data.token,username:data.username,firstname:data.firstname})
    } else {
      res.json({result:false,error:'User not found'})
    }
  })
})


module.exports = router;
