const signup = document.getElementById("signup");

signup.addEventListener("submit", function (e) {
  Signup(this);
  e.preventDefault();
});

async function Signup(form) {
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
    // result
    // 0 than email already exists
    // 1 signup done
    // -1 Invalid email or password

    console.log(result);

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
          "Email Already Exist. <a href='/login'>Log in</a> here";
        break;
      case -1:
        msgText.innerHTML = "Invalid Email or password. Try Again!";
        break;
      default:
        msgText.innerHTML =
          "Something went wrong. Please try again after sometimes.";
        break;
    }
  } catch (err) {
    console.error(`Error in Signup function.`);
  }
}
