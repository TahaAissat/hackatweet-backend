const mongoose = require ('mongoose')


const tweetsSchema = mongoose.Schema({
    texte : String,
    username : String,
    token : String,
    hashtag : String,
    date : Date
})

const Tweet = mongoose.model ('tweets' , tweetsSchema)

module.exports = Tweet