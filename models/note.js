const mongoose = require('mongoose')

const { MONGODB_URI } = process.env

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not defined')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name must be at least 3 characters long'],
    required: [true, 'name is required'],
    unique: true,
  },
  number: {
    type: String,
    required: [true, 'number is required'],
    validate: {
      validator: (value) => /^\d{2,3}-\d+$/.test(value),
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
