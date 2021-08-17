require("dotenv").config();

const express = require("express");
const routes = require("./routes");
const cookieparser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 4000;

const DB = process.env.DBTESTURL || process.env.DBURL;

// TODO: connection with mongoAtlas and server
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(
        `Connection stablish with Atlas | \n Server is running on ${PORT}...`
      )
    )
  )
  .catch((error) =>
    console.log(`Error while connecting with server: ${error.message}`)
  );

const staticFiles = path.join(__dirname, "./public");

app.use(express.static(staticFiles));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/", routes);
