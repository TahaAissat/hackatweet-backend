var express = require('express')
var router = express.Router();
const Tweet = require('../models/tweets');
const {checkBody} = require('../modules/checkBody')


router.post('/add' , (req,res) => {
    if(!checkBody(req.body,['texte','token'])){
        res.json({result:false,error:'Missing text'})
        return
    }
    const newTweet = new Tweet ({
        texte : req.body.texte,
        username : req.body.username,
        token : req.body.token,
        hashtag : req.body.hashtag,
        date : new Date()
    })
    newTweet.save()
    .then(() => {
        res.json({result:true})
    })
})

router.get('/latest' , (req,res) => {
    Tweet.find({})
    .then ( data => {
        res.json ({result:true , tweets : data})
    })
})

router.get('/search/:hashtag' , (req,res) => {
    Tweet.find({hashtag : new RegExp(req.body.hashtag,'i')})
    .then( data => {
        if(data){
            res.json({result:true , tweets : data})
        } else {
            res.json({result:false , error : 'No tweets with this hashtag'})
        }
    })
})


module.exports = router;