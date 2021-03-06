const bcrypt = require("bcryptjs")
const usersCollection = require("../db").db().collection("users")
const validator = require("validator")
const md5 = require("md5")

let User = function (data, getAvatar) {
  this.data = data
  this.errors = []
  if (getAvatar == undefined) { getAvatar = false }
  if (getAvatar) { this.getAvatar() }
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
  return new Promise(async (resolve, reject) => {
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

    // Only if username is valid then check to see if it s already taken
    if (this.data.username.length > 2 && this.data.username.length < 41 && validator.isAlphanumeric(this.data.username)) {
      let usernameExists = await usersCollection.findOne({ username: this.data.username })
      if (usernameExists) { this.errors.push("That username is already taken.") }
    }

    // Only if email is valid then check to see if it s already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({ email: this.data.email })
      if (emailExists) { this.errors.push("That email is already taken.") }
    }
    resolve()
  })
}

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // Step 1: Validate user data
    this.cleanUp()
    await this.validate()

    // Step 2: Only if there are no validation errors
    // hash password
    // then save the user data into a database
    if (!this.errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10)
      this.data.password = bcrypt.hashSync(this.data.password, salt)

      // Look into the database users collection/table to insert new data
      await usersCollection.insertOne(this.data)
      this.getAvatar()
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    // Look into the database users collection/table to read/see if there is the data
    usersCollection.findOne({ username: this.data.username }).then((attemptedUser) => {
      // Compare login info with login and hashed password
      if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
        this.data = attemptedUser
        this.getAvatar()
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

User.prototype.getAvatar = function () {
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

User.findByUsername = function (username) {
  return new Promise(function (resolve, reject) {
    if (typeof (username) !== "string") {
      reject()
      return
    }

    usersCollection.findOne({ username }).then(function (userDoc) {
      if (userDoc) {
        userDoc = new User(userDoc, true)
        userDoc = {
          _id: userDoc.data._id,
          username: userDoc.data.username,
          avatar: userDoc.avatar
        }
        resolve(userDoc)
      } else {
        reject()
      }
    }).catch(function () {
      reject()
    })
  })
}

User.doesEmailExist = function (email) {
  return new Promise(async function (resolve, reject) {
    if (typeof (email) !== "string") {
      resolve(false)
      return
    }

    let user = await usersCollection.findOne({ email })
    if (user) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

module.exports = User