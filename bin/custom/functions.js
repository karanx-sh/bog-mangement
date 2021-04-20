const jwt = require("jsonwebtoken");
const { use } = require("../../app");
const User = require("../models/user");
const moment = require("moment-timezone");
const customError = require("../custom/errors");

let AccessLimit = (tokens) => {
  let length = tokens.length;
  console.log(length);
  // if (length > process.env.MAXCONCURRENTLOGINS) length = process.env.MAXCONCURRENTLOGINS;
  console.log(length <= process.env.MAXCONCURRENTLOGINS);
  if (length < process.env.MAXCONCURRENTLOGINS) {
    return true;
  } else {
    return false;
  }
};
const tokenGenerator = (user, resetTokens = false) => {
  try {
    let accessExpiry = parseInt(process.env.ACCESSEXPIRY, 10),
      refreshExpiry = parseInt(process.env.REFRESHEXPIRY, 10),
      access = jwt.sign({ id: user.id, type: "access" }, process.env.JWT_KEY, {
        expiresIn: accessExpiry,
      }),
      refresh = jwt.sign(
        { id: user.id, type: "refresh" },
        process.env.JWT_KEY,
        { expiresIn: refreshExpiry }
      );

    if (resetTokens) user.tokens = [];
    let tokens = JSON.parse(user.tokens);
    if (AccessLimit(tokens)) {
      tokens.unshift({
        refresh: refresh,
        access: access,
      });
    } else {
      tokens.pop();
      tokens.unshift({
        refresh: refresh,
        access: access,
      });
    }

    // console.log(tokens);
    user.tokens = JSON.stringify(tokens);
    user.OTP = {};
    user.save();

    return {
      access: {
        token: access,
        expiryin: accessExpiry,
      },
      refresh: {
        token: refresh,
        expiryin: refreshExpiry,
      },
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const random = (length) => {
  let code = Math.random().toString().split(".")[1].slice(0, length);
  if (code.length !== length) {
    code = random;
  }
  return code;
};

const makeRandom =(length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const message = (to, message) => {
  console.log(`${message} sent to ${to} via message`);
  return true; //text.send(to, message);
};

const compareTime = (time1, time2, condition = 1) => {
  switch (condition) {
    case 1:
      return (new Date(time1) - new Date(time2)) / 1000;
  }
};

const generateOTP = (length,number) => {
  code = random(length),
      validTill = moment
        .tz(
          new Date(Date.now() + process.env.OTPVALIDINMIN * 60000),
          "ASIA/KOLKATA"
        )
        .toString(),
      messageText = `${code} is the OTP for the action initiated at ${
        process.env.PROJECTNAME
      }, this code is valid till ${validTill
        .split(" ")[4]
        .slice(0, 5)}\n#HaveAGoodTime`;
  if (!message(number, messageText)) throw customError.serverDown;
    return {
      code: code,
          validTill: validTill,
          messageSentAt: moment.tz(Date.now(), "ASIA/KOLKATA").toString(),
    };
}

module.exports = { tokenGenerator, random, makeRandom ,message, compareTime,generateOTP };
