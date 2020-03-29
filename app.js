const express = require("express")
const app = express()

// Make "public" folder accessible
app.use(express.static("public"))

// Let express knows where our view folder is (second "views")
app.set("views", "views")

// Let express knows what template engine we use (ejs)
app.set("view engine", "ejs")

app.get("/", function (req, res) {
  res.render("home-guest")
})

app.listen(3000)