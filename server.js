
require("dotenv").config()
const app = require('./app')

const mongoose = require("mongoose");

const { DB_HOST } = process.env



mongoose.connect(DB_HOST).then(() => {
  app.listen(3000)
  console.log(DB_HOST)
}).catch(error => {
  console.log(error)
  process.exit(1)
})

