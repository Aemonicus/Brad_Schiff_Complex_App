const mongodb = require("mongodb")

const connectionString = "mongodb+srv://todoAppUser:lkjpoi@cluster0-pmm3r.mongodb.net/ComplexApp?retryWrites=true&w=majority"

mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  module.exports = client.db()
  const app = require("./app")
  app.listen(3000)
})