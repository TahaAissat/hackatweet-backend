var express = require('express')
var router = express.Router();
const Tweet = require('../models/tweets');
const User = require('../models/users')
const {checkBody} = require('../modules/checkBody')


router.post('/add' , (req,res) => {
    if(!checkBody(req.body,['texte','token'])){
        res.json({result:false,error:'Missing text'})
        return
    }
    const newTweet = new Tweet ({
        texte : req.body.texte,
        firstname : req.body.firstname,
        username : req.body.username,
        token : req.body.token,
        hashtag : req.body.hashtag,
        likes : [],
        date : new Date()
    })
    newTweet.save()
    .then(() => {
        Tweet.find({})
        .then((data) => {
            console.log(data)
            res.json({result:true, tweets : data})
        })  
    })
})

router.get('/latest' , (req,res) => {
    Tweet.find({})
    .then ( data => {
        res.json ({result:true , tweets : data})
    })
})

router.get('/search/:hashtag' , (req,res) => {
    Tweet.find({hashtag :'#'+req.params.hashtag})
    .then( data => {
        if(data.length>0){
            res.json({result:true , tweets : data})
        } else {
            res.json({result:false , error : 'No tweets with this hashtag'})
        }
    })
})

router.delete('/delete' ,(req,res) => {
    Tweet.deleteOne({username : req.body.username,token:req.body.token,texte:req.body.texte})
    .then (data => {
        if(data.deletedCount > 0){
            res.json({result:true,message: 'Tweet has been deleted'})
        } else {
            res.json({result:false,error:'tweet has not been found'})
        }
    })
})

router.post('/addlike',(req,res) => {
    if(req.body.token !== null){
    Tweet.updateOne({username:req.body.username,texte:req.body.texte},{$push:{likes:req.body.token}})
        .then(() => {
            Tweet.findOne({username:req.body.username,texte:req.body.texte})
                 .then(data => {
                    res.json({result:true,likes:data.likes})
        }) 
    })}
})

router.post('/removeLike',(req,res) => {
    Tweet.updateOne({username:req.body.username,texte:req.body.texte},{$pull:{likes:req.body.token}})
    .then(()=> {
        Tweet.findOne({username:req.body.username,texte:req.body.texte})
        .then((data) => {
            res.json({result:true,likes:data.likes})
        })
    })

})



module.exports = router;