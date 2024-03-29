const mongoose = require ('mongoose')


const tweetsSchema = mongoose.Schema({
    texte : String,
    firstname : String,
    username : String,
    token : String,
    hashtag : Array,
    date : Date,
    likes : [String],
})

const Tweet = mongoose.model ('tweets' , tweetsSchema)

module.exports = Tweet