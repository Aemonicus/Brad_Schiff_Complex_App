export default class RegistrationForm {
  constructor() {
    this.allFields = document.querySelectorAll("#registration-form .form-control")
    this.insertValidationElements()
    this.username = document.querySelector("#username-register")
    this.username.previousValue = ""
    this.events()
  }

  // Events
  events() {
    this.username.addEventListener("keyup", () => {
      this.isDifferent(this.username, this.usernameHandler)
    })
  }

  // Methods
  isDifferent(item, handler) {
    if (item.previousValue !== item.value) {
      handler.call(this)
    }
    item.previousValue = item.value
  }

  usernameHandler() {
    this.username.errors = false
    this.usernameImmediately()
    clearTimeout(this.username.timer)
    this.username.timer = setTimeout(() => this.usernameAfterDelay(), 3000)
  }

  usernameImmediately() {
    if (this.username.value !== "" && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
      this.showValidationError(this.username, "Username can only contain letters and numbers")
    }

    if (this.username.value.length > 30) {
      this.showValidationError(this.username, "Username cannot exceed 30 characters")
    }

    if (!this.username.errors) {
      this.hideValidationError(this.username)
    }
  }

  hideValidationError(item) {
    item.nextElementSibling.classList.remove("liveValidateMessage--visible")
  }

  showValidationError(item, message) {
    item.nextElementSibling.innerHTML = message
    item.nextElementSibling.classList.add("liveValidateMessage--visible")
    item.errors = true
  }

  usernameAfterDelay() {
    if (this.username.value.length < 4) {
      this.showValidationError(this.username, "Username must be at least 4 characters")
    }
  }

  insertValidationElements() {
    this.allFields.forEach(function (item) {
      item.insertAdjacentHTML("afterend", '<div class="alert alert-danger small liveValidateMessage"></div>')
    })
  }


}