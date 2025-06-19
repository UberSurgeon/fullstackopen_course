import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
    },
    name: String,
    passwordHashed: {
        type: String,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
        delete returnObject.passwordHashed
    }
})

const User = mongoose.model('User', userSchema)

export default User
