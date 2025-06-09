import mongoose from "mongoose";

let f_switch = false

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length == 3){
    f_switch = true
}

const password = process.argv[2]
const url = `mongodb+srv://nathan:${password}@cluster0.4qmxkzi.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const format_person = (json) => {
    return `${json.name} ${json.number}`
}


if (f_switch){
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(note => {
            console.log(format_person(note))
        })
        mongoose.connection.close()
    })

} else{
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}










