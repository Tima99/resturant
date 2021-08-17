async function GetAccount() {
  try {
    const response = await fetch("/account");

    const result = await response.text();

    switch (result) {
      case "0":
        window.location.pathname = `/login`;
        break;
      default:
        document.getElementById("accountname").innerHTML = result;
        break;
    }
  } catch (err) {
    console.error(
      `Error Occur Infile : accountDetails.js InMethod : GetAccount ${err.message}`
    );
  }
}

async function LogOut(btn) {
  try {
    btn.style.pointerEvents = "none";

    const response = await fetch("/logout");

    const result = await response.text();

    if (result === "Logout") {
      alert("Log Out Sucessfully.\nYou have to Log In again to place order.")
      window.location.pathname = `/login`;
    }
  } catch (err) {
    console.error(err);
  }
}
