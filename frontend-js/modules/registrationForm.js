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
    alert("username handler ran")
  }

  insertValidationElements() {
    this.allFields.forEach(function (item) {
      item.insertAdjacentHTML("afterend", '<div class="alert alert-danger small liveValidateMessage"></div>')
    })
  }


}