const express = require("express");
const router = express.Router();
const path = require("path");
const validator = require("email-validator");
const account = require("./models/accountSchema");
const authentication = require("./middleware/authenticate");

const staticFiles = path.join(__dirname, "./public");

router.get("/", authentication, async (req, res) => {
  try {
    if (req.user) res.sendFile("./home.html", { root: staticFiles });
    else res.redirect("./signup");
  } catch (err) {
    console.log(`Error on route '/' : ${err.message}`);
  }
});

router.get("/account", authentication, async (req, res) => {
  try {
    if (req.user) {
    //   console.log("Authenticate User");
      res.end(req.user.email);
    } else {
      console.log("Un - Authenticate User Login");
      res.end("0");
    }
  } catch (err) {
    console.log(`Error while '/account' : ${err.message}`);
    res.status(500).send(err.message);
  }
});

router.get("/logout", authentication, async (req, res) => {
  try {
    res.clearCookie("jwt"); // remove cookie from user browser

    req.user.tokens = req.user.tokens.filter((ele) => ele.token !== req.token); // remove from database

    const newdoc = await req.user.save();

    res.end("Logout");
  } catch (err) {
    console.log(`Error while '/logout' : ${err.message}`);
    res.status(401).send(err.message);
  }
});

// serve pages to client
router.get("/signup", (req, res) => {
  res.sendFile("./signup.html", { root: staticFiles });
});

router.get("/login", (req, res) => {
  res.sendFile("./login.html", { root: staticFiles });
});

// save records to database
router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmpwd } = req.body;
    const isEmailValid = validator.validate(email);
    const isPasswordValid = password.length >= 6;
    // console.log(isEmailValid , isPasswordValid)
    if (!(isEmailValid && isPasswordValid && password === confirmpwd)) {
      // Invalid email or password
      // console.log(req.body)
      res.end("-1");
      return;
    }

    const emailPresent = await account.find({ email });

    if (!emailPresent.length) {
      // new user signup - create its account
      // if password and confirmpassword matched and email is valid

      const user = new account(req.body);

      const token = await user.generateJWT();

      // *save token as cookie to client browser
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 10000000000),
        httpOnly: true,
      });
      res.end("1"); // response 1 as signup sucess
    } else {
      // user has already account with given email
      res.end("0");
    }
  } catch (err) {
    console.log(`Error on '/signup' : ${err.message}`);
    res.end("401");
    res.status(401).send(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmailValid = validator.validate(email);
    const isPasswordValid = password.length >= 6;

    if (!(isEmailValid && isPasswordValid)) {
      // Invalid Email or password
      res.end("-1");
      return;
    }

    const user = await account.findOne({ email });

    if (user) {
      if (user.password === password) {
        const token = await user.generateJWT();
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 10000000000),
          httpOnly: true,
        });
        res.end("1"); // response 1 as signup sucess
      } else {
        // password not matched
        res.end("-2");
      }
    } else {
      // account not created with given email
      res.end("0");
    }
  } catch (err) {
    console.log(`Error while '/login' : ${err.message}`);
    res.end("401");
    res.status(401).send(err);
  }
});

// save order to database

router.post('/order', authentication , async(req , res)=>{
    try{
        if(req.user){

            req.user.orders.push(req.body);
            const orderBook = await req.user.save()
            
            if(orderBook)
                res.end('1')
            else
                res.end('-1')
        }
        else{
            res.redirect("./signup")
        }
    }
    catch(err){
        console.log(`Error '/order' : ${err.message}`)
        res.status(401).send(err);
    }
})

router.get('/ordershistory', authentication, async(req, res)=>{
    try{
        if(req.user){
            if(req.user.orders.length === 0 || !req.user.orders.length){
                res.send('<h2>You have not place any Order.</h2><a href="/">Go Home</a>')
            }
            else
            res.json(req.user.orders)
            
        }
        else{
            res.redirect('/signup')
        }
    }
    catch(err){
        console.log(err.message)
    }
})

module.exports = router;
