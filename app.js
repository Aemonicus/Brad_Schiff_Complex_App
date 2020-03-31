const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const app = express()

let sessionOptions = session({
  secret: "lolilol",
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true } // durée du cookie = une journée dans notre cas
})

app.use(sessionOptions)

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
