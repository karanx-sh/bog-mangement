require("dotenv/config");
const express = require("express");
const app = express();
const moment = require("moment-timezone");
const morgan = require("morgan");
const path = require("path");
const db = require("./connection");
const CustomError = require("./bin/custom/error");



db.authenticate()
  .then(async () => {
    await db.sync();
    console.log("Database is connected...");
  })
  .catch((err) => {
    console.log(`Database Error :${err}`);
  });



//******* Associations ******\\




//******* SETTING CORS HEADER *******\\
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//******* HIDING EXPRESS *******\\
app.set("x-powered-by", false);
app.use(function (req, res, next) {
  res.header(
    "Efforts",
    ":)"
  );
  next();
});

//******* MIDDLEWARES *******\\
app.use(
  morgan(function (tokens, req, res) {
    let dates = moment.tz(Date.now(), "Asia/Kolkata").toString().split(" ");
    return [
      req.headers.ip,
      dates[2] + dates[1].toUpperCase() + dates[3].slice(-2),
      dates[4],
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);
app.use(express.json());
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: true, limit: "100mb" }));
app.use(require("body-parser").json({ limit: "100mb" }));
app.set('view engine', 'ejs'); // setting view engine to ejs 
app.use('/images',express.static(path.join(__dirname,'uploads/blog'))); // serving Blog images
app.use(express.static('public')); // serving static files

//******* IMPORTING THE ROUTES *******\\
const blogRoutes = require("./bin/routes/blog");


//******* USING THE ROUTES *******\\
app.use("/blog", blogRoutes);


//******* ERROR HANDLING *******\\
app.use((req, res, next) => {
  const error = new CustomError(
    "Not Found!",
    `Uh oh! the path you are trying to reach we can't find it, we've checked each an every corner!`,
    404
  );
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    error: true,
    details: error,
  });
});

module.exports = app;
