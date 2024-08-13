const express = require("express");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.post("/login", (req, res) => {
  const { name, email } = req.body;
  const user = {
    name,
    email,
  };
  jwt.sign(user, secretKey, { expiresIn: "1d" }, (err, token) => {
    res.json({
      token,
    });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.header("x-auth-token");

  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader;
    req.bearer = bearer;
    next();
  } else {
    res.send({
      message: "Access denied. No token provided.",
    });
  }
}

app.get("/profile", verifyToken, (req, res) => {
  jwt.verify(req.bearer, secretKey, (err, authData) => {
    if (err) {
      res.json({ message: "Error" });
    } else {
      res.json({ authData, success: true });
    }
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
