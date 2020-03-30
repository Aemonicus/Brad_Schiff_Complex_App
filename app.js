const express = require("express")
const app = express()

const router = require("./router")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// Make "public" folder accessible
app.use(express.static("public"))

// Let express knows where our view folder is (second "views")
app.set("views", "views")

// Let express knows what template engine we use (ejs)
app.set("view engine", "ejs")

app.use("/", router)

module.exports = app
