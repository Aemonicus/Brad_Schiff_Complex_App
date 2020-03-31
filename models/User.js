const bcrypt = require("bcryptjs")
const usersCollection = require("../db").collection("users")
const validator = require("validator")

let User = function (data) {
  this.data = data
  this.errors = []
}

User.prototype.cleanUp = function () {
  if (typeof (this.data.username) !== "string") {
    this.data.username = ""
  }
  if (typeof (this.data.email) !== "string") {
    this.data.email = ""
  }
  if (typeof (this.data.password) !== "string") {
    this.data.password = ""
  }

  // Get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

User.prototype.validate = function () {
  if (this.data.username === "") {
    this.errors.push("You must provide a username")
  }
  if (this.data.username !== "" && !validator.isAlphanumeric(this.data.username)) {
    this.errors.push("Username can only contain letters and numbers")
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email")
  }
  if (this.data.password === "") {
    this.errors.push("You must provide a password")
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("Password must be at least 12 characters")
  }
  if (this.data.password.length > 40) {
    this.errors.push("Password cannot exceed 40 characters")
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters")
  }
  if (this.data.username.length > 40) {
    this.errors.push("Username cannot exceed 40 characters")
  }
}

User.prototype.register = function () {
  // Step 1: Validate user data
  this.cleanUp()
  this.validate()

  // Step 2: Only if there are no validation errors
  // hash password
  // then save the user data into a database
  if (!this.errors.length) {
    // hash user password
    let salt = bcrypt.genSaltSync(10)
    this.data.password = bcrypt.hashSync(this.data.password, salt)

    // Look into the database users collection/table to insert new data
    usersCollection.insertOne(this.data)
  }
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    // Look into the database users collection/table to read/see if there is the data
    usersCollection.findOne({ username: this.data.username }).then((attemptedUser) => {
      // Compare login info with login and hashed password
      if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
        resolve("Congrats!")
      } else {
        reject("Invalid username / password")
      }
    }).catch(function () {
      if (!attemptedUser && attemptedUser.password === this.data.password) {
        reject("Please try again later")
      }
    })
  })
}

module.exports = User