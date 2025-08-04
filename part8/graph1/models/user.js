const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: { type: String, required: true},
    favoriteGenre: { type: String, required: true}
})

module.exports = mongoose.model('User', schema)
//   type User {
//     username: String!
//     favoriteGenre: String!
//     id:: ID!
//   }
