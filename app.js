const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const flash = require("connect-flash")
const markdown = require("marked")
const sanitizeHTML = require("sanitize-html")

const app = express()

let sessionOptions = session({
  secret: "lolilol",
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true } // durée du cookie = une journée dans notre cas
})

app.use(sessionOptions)
app.use(flash())

app.use(function (req, res, next) {
  // make our markdown function available from within ejs template
  // with sanitize (protec from malicious code)
  res.locals.filterUserHTML = function (content) {
    return sanitizeHTML(markdown(content), { allowedTags: ["p", "br", "ul", "ol", "li", "strong", "bold", "i", "em", "h1", "h2", "h3"], allowedAttributes: {} })
  }

  // make all errors and success flash messages available from all messages
  res.locals.errors = req.flash("errors")
  res.locals.success = req.flash("success")

  // make current user id available on the req object
  if (req.session.user) { req.visitorId = req.session.user._id } else { req.visitorId = 0 }

  // make user session data available from within view templates
  res.locals.user = req.session.user
  next()
})

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

const server = require("http").createServer(app)

const io = require("socket.io")(server)

io.on("connection", function (socket) {
  socket.on("chatMessageFromBrowser", function (data) {
    io.emit("chatMessageFromServer", { message: data.message })
  })
})

module.exports = server 
