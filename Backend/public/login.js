const login = document.getElementById("login");

login.addEventListener("submit", function (e) {
  Login(this);
  e.preventDefault();
});

async function Login(form) {
  try {
    // button noclickable
    document.getElementById("btn").style.pointerEvents = "none";
    document.getElementById("btn").style.opacity = ".8";

    const msgText = document.querySelector(".msg-text");
    msgText.parentElement.style.opacity = "0";

    const formData = new URLSearchParams(new FormData(form));
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
    });
    const result = Math.floor(await response.text());
    console.log(result);
    // if result
    // 0 account not created yet
    // -1 invalid email or password
    // -2 password wrong

    if (result !== 1) {
      msgText.parentElement.style.opacity = "1";
      document.getElementById("btn").style.pointerEvents = "all";
      document.getElementById("btn").style.opacity = "1";
    }

    switch (result) {
      case 1:
        window.location.pathname = "/";
        break;
      case 0:
        msgText.innerHTML =
          "Email not registered. <a href='/signup'>Sign Up </a> now.";
        break;
      case -1:
        msgText.innerHTML = "Invalid email or password. Try again.";
        break;
      case -2:
        msgText.innerHTML = "Password Wrong. Try Again.";
        break;
      default:
        msgText.innerHTML =
          "Something went wrong. Please try again after sometimes.";
        break;
    }
  } catch (err) {
    console.error("Error while sending login entries." + err);
  }
}
