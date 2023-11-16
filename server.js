const express = require("express");
// const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
// const { jwtDecode } = require("jwt-decode");
// const querystring = require("querystring");
// const url = require("url");
// const Users = require("./models/Users");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = new express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const secretKey = "secret_key";
// const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
//App running on Port 3000
app.listen(3000, () => {
  console.log("App running on port 3000");
});
//connect to DB
// const connectDB = () => {
//   try {
//     mongoose.connect("mongodb://localhost:27017/user");
//     console.log("Connect to MongoDB successful!");
//   } catch (error) {
//     res.status(401).json({ error: "Connection to DB failed!" });
//   }
// };
// connectDB();

//verify Token
const verifyToken = (req, res, next) => {
  //Get Authentication Header Value
  const tokenHeader = req.headers["authorization"];
  //check if bearer is undefined
  if (typeof tokenHeader !== "undefined") {
    //split the space
    const bearer = tokenHeader.split(" ");
    //get token from array
    const bearerToken = bearer[1];
    //set token
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

//fake data
const db = {
  username: "JS",
  password: "testing123",
  full_name: "John Smith",
  id: 1,
  display_identifier: "",
  sort: 1,
  order_number: 1,
  load_status: "",
  load_status_label: 1,
  active: true,
  current: false,
};
//Generate token
const createToken = (id) => {
  return jwt.sign({ id }, secretKey, { expiresIn: "1h" });
};

//home route
app.get("/", (req, res) => {
  res.send("Welcome, Have a wonderful day!");
});
//POST Route
app.post("/login/users", (req, res) => {
  const username = db.find(req.body.username);
  const password = db.find(req.body.password);

  try {
    if (db.username === username && db.password === password) {
      //create token
      const token = createToken(db._id);
      res.json({ full_name: db.full_name, api_token: token });
    }
  } catch (error) {
    res.status(400).json({ error: "User does not exist" });
  }
});
// login route
app.get("/login/users", (req, res) => {
  const fullName = req.body.full_name;
  const sort = req.body.sort;
  console.log(fullName);
  res.json({ full_name: fullName, sort: sort });
});

app.get("/login/users/:token", async (req, res) => {
  const username = req.body.username;
  const jwtToken = await db.find(req.params.token);
  console.log(req.params);
  //create token
  const token = jwt.sign({ username }, "secret_key");
  const decoded = jwtDecode(token);
  //decode jwt

  jwt.verify(token, (err, decoded) => {
    if (err) {
      res.status(401).json({ err });
    } else {
      const userToken = decoded.token;
      res.json({ full_name: db.full_name, api_token: userToken });
    }
  });
});

//Load Route
app.get("/load", verifyToken, (req, res) => {
  const dataBase = db.dataBase("db");
  dataBase.find({}).toArray((error, data) => {
    if (error) {
      res.status(500).send("Cannot retrieve, server error");
    } else {
      res.json(data);
    }
  });
  // const loadData = ({
  //   id,
  //   display_identifier,
  //   sort,
  //   order_number,
  //   load_status,
  //   load_status_label,
  //   active,
  //   current,
  // } = req.body);
  // const myData = [];

  // myData.push(loadData);
  // return res.json(myData);
});
